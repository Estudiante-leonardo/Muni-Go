package com.tramites.backend.application.usecases;

import com.tramites.backend.domain.model.ChatResponseDto;
import com.tramites.backend.domain.ports.in.RagChatUseCase;
import com.tramites.backend.domain.ports.out.TramiteRepositoryPort;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.messages.MessageType;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;

import java.util.List;
import java.util.stream.Collectors;

public class RagChatUseCaseImpl implements RagChatUseCase {

    private static final String SYSTEM_PROMPT_BASE =
            "Eres \"Manuelito\", el Asistente Municipal IA de la %s. " +
            "REGLAS ESTRICTAS:\n" +
            "1. SOLO respondes preguntas sobre trámites y servicios de la Municipalidad.\n" +
            "2. Si preguntan algo fuera de tema (deportes, política, tareas, etc.), responde: " +
            "\"Lo siento, solo puedo ayudarte con trámites y consultas de la Municipalidad. ¿Tienes alguna duda sobre un trámite?\"\n" +
            "3. Responde de forma breve, clara y amigable. Máximo 3-4 oraciones.\n" +
            "5. No inventes información. Si no sabes algo, sugiere acercarse a mesa de partes.\n" +
            "6. Si ya saludaste o te presentaste en mensajes anteriores de esta conversación, ve directo a la respuesta sin presentarte de nuevo.\n" +
            "7. Si tu respuesta incluye información extraída de la INFORMACIÓN DE LA BASE DE DATOS proporcionada, DEBES incluir OBLIGATORIAMENTE al final de tu respuesta la etiqueta secreta: [REF]. Si es solo un saludo o no usas la base de datos, NO incluyas esa etiqueta.\n";

    private final ChatClient chatClient;
    private final VectorStore vectorStore;
    private final TramiteRepositoryPort tramiteRepository;
    private final ChatMemory chatMemory;

    public RagChatUseCaseImpl(ChatModel chatModel, VectorStore vectorStore, TramiteRepositoryPort tramiteRepository, ChatMemory chatMemory) {
        this.chatClient = ChatClient.builder(chatModel).build();
        this.vectorStore = vectorStore;
        this.tramiteRepository = tramiteRepository;
        this.chatMemory = chatMemory;
    }

    @Override
    public ChatResponseDto chat(String mensaje, Long tramiteId, String sessionId, String municipalidadNombre, Long municipalidadId) {
        String muniName = (municipalidadNombre != null && !municipalidadNombre.isBlank()) 
                ? municipalidadNombre 
                : "Municipalidad";
        String systemPrompt = String.format(SYSTEM_PROMPT_BASE, muniName);

        if (tramiteId != null) {
            var tramiteOpt = tramiteRepository.findById(tramiteId);
            if (tramiteOpt.isPresent()) {
                systemPrompt += "\n\nEl usuario está consultando sobre el trámite seleccionado. " +
                        "Usa la información recuperada de la base de conocimiento para responder.\n";
            }
        }

        String filterExpr = null;
        if (tramiteId != null) {
            filterExpr = "tramiteId == " + tramiteId;
        } else if (municipalidadId != null) {
            filterExpr = "municipalidadId == " + municipalidadId;
        }

        // Construir la consulta de búsqueda combinando los últimos mensajes del usuario con el actual
        List<Message> history = chatMemory.get(sessionId); // Traemos algo de historia para contexto
        StringBuilder searchContext = new StringBuilder();
        if (history != null && !history.isEmpty()) {
            // Take up to last 4 messages if the list is long
            int startIndex = Math.max(0, history.size() - 4);
            for (int i = startIndex; i < history.size(); i++) {
                Message m = history.get(i);
                if (m.getMessageType() == MessageType.USER) {
                    searchContext.append(m.getText()).append(". ");
                }
            }
        }
        String searchQuery = (searchContext + mensaje).trim();

        // Realizar la búsqueda vectorial manual
        List<Document> documents = vectorStore.similaritySearch(
                SearchRequest.builder()
                        .query(searchQuery)
                        .similarityThreshold(0.65)
                        .topK(5)
                        .filterExpression(filterExpr)
                        .build()
        );

        Long suggestedTramiteId = null;
        String suggestedTramiteNombre = null;

        if (documents != null && !documents.isEmpty()) {
            String documentContext = documents.stream()
                    .map(Document::getText)
                    .collect(Collectors.joining("\n\n"));
            systemPrompt += "\n\nINFORMACIÓN DE LA BASE DE DATOS (Usa esta información para responder a la consulta del usuario):\n" + documentContext + "\n";
            
            // Extraer el tramiteId sugerido del documento más relevante
            Document topDoc = documents.get(0);
            if (topDoc.getMetadata().containsKey("tramiteId")) {
                Object metaTramiteId = topDoc.getMetadata().get("tramiteId");
                if (metaTramiteId instanceof Number) {
                    suggestedTramiteId = ((Number) metaTramiteId).longValue();
                } else if (metaTramiteId instanceof String) {
                    try {
                        suggestedTramiteId = Long.parseLong((String) metaTramiteId);
                    } catch (NumberFormatException ignored) {}
                }
            }
            if (topDoc.getMetadata().containsKey("nombre")) {
                suggestedTramiteNombre = (String) topDoc.getMetadata().get("nombre");
            }
        }

        var memoryAdvisor = MessageChatMemoryAdvisor.builder(chatMemory).build();

        String respuestaLlm;
        try {
            respuestaLlm = chatClient.prompt()
                    .system(systemPrompt)
                    .user(mensaje)
                    .advisors(memoryAdvisor)
                    .advisors(a -> a.param(ChatMemory.CONVERSATION_ID, sessionId))
                    .call()
                    .content();
                    
            if (respuestaLlm != null && respuestaLlm.contains("[REF]")) {
                respuestaLlm = respuestaLlm.replace("[REF]", "").trim();
            } else {
                // El LLM no usó la base de datos (fue un saludo, fuera de tema, etc.)
                suggestedTramiteId = null;
                suggestedTramiteNombre = null;
            }
            
        } catch (Exception e) {
            respuestaLlm = "Lo siento, estoy teniendo dificultades técnicas en este momento. " +
                   "Por favor, intenta de nuevo en unos segundos o acércate a mesa de partes para ayuda presencial.";
            suggestedTramiteId = null;
            suggestedTramiteNombre = null;
        }
        
        return new ChatResponseDto(respuestaLlm, suggestedTramiteId, suggestedTramiteNombre);
    }
}
