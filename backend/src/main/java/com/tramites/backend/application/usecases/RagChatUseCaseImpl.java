package com.tramites.backend.application.usecases;

import com.tramites.backend.domain.ports.in.RagChatUseCase;
import com.tramites.backend.domain.ports.out.TramiteRepositoryPort;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.vectorstore.QuestionAnswerAdvisor;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;

public class RagChatUseCaseImpl implements RagChatUseCase {

    private static final String SYSTEM_PROMPT_BASE =
            "Eres \"Manuelito\", el Asistente Municipal IA de la Municipalidad de Carabayllo. " +
            "REGLAS ESTRICTAS:\n" +
            "1. SOLO respondes preguntas sobre trámites y servicios de la Municipalidad.\n" +
            "2. Si preguntan algo fuera de tema (deportes, política, tareas, etc.), responde: " +
            "\"Lo siento, solo puedo ayudarte con trámites y consultas de la Municipalidad. ¿Tienes alguna duda sobre un trámite?\"\n" +
            "3. Responde de forma breve, clara y amigable. Máximo 3-4 oraciones.\n" +
            "4. Siempre menciona costos en Soles (S/).\n" +
            "5. No inventes información. Si no sabes algo, sugiere acercarse a mesa de partes.\n";

    private final ChatClient chatClient;
    private final VectorStore vectorStore;
    private final TramiteRepositoryPort tramiteRepository;

    public RagChatUseCaseImpl(ChatModel chatModel, VectorStore vectorStore, TramiteRepositoryPort tramiteRepository) {
        this.chatClient = ChatClient.builder(chatModel).build();
        this.vectorStore = vectorStore;
        this.tramiteRepository = tramiteRepository;
    }

    @Override
    public String chat(String mensaje, Long tramiteId, String sessionId) {
        String systemPrompt = SYSTEM_PROMPT_BASE;

        if (tramiteId != null) {
            var tramiteOpt = tramiteRepository.findById(tramiteId);
            if (tramiteOpt.isPresent()) {
                systemPrompt += "\n\nEl usuario está consultando sobre el trámite seleccionado. " +
                        "Usa la información recuperada de la base de conocimiento para responder.\n";
            }
        }

        String filterExpr = tramiteId != null ? "tramiteId == " + tramiteId : null;

        var advisor = QuestionAnswerAdvisor.builder(vectorStore)
                .searchRequest(SearchRequest.builder()
                        .similarityThreshold(0.65)
                        .topK(5)
                        .filterExpression(filterExpr)
                        .build())
                .build();

        try {
            return chatClient.prompt()
                    .system(systemPrompt)
                    .user(mensaje)
                    .advisors(advisor)
                    .call()
                    .content();
        } catch (Exception e) {
            return "Lo siento, estoy teniendo dificultades técnicas en este momento. " +
                   "Por favor, intenta de nuevo en unos segundos o acércate a mesa de partes para ayuda presencial.";
        }
    }
}
