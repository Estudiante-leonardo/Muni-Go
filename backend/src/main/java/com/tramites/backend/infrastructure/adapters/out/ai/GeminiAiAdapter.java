package com.tramites.backend.infrastructure.adapters.out.ai;

import com.tramites.backend.domain.ports.out.AiChatPort;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.chat.messages.SystemMessage;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.google.genai.GoogleGenAiChatOptions;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class GeminiAiAdapter implements AiChatPort {

    private static final Logger log = LoggerFactory.getLogger(GeminiAiAdapter.class);

    private final ChatModel chatModel;

    public GeminiAiAdapter(ChatModel chatModel) {
        this.chatModel = chatModel;
    }

    @Override
    public String enviarMensaje(String systemPrompt, String userMessage) {
        try {
            ChatResponse response = chatModel.call(
                    new Prompt(
                            List.of(
                                    new SystemMessage(systemPrompt),
                                    new UserMessage(userMessage)
                            ),
                            GoogleGenAiChatOptions.builder()
                                    .model("gemini-3.1-flash-lite")
                                    .build()
                    )
            );

            if (response != null && response.getResult() != null
                    && response.getResult().getOutput() != null
                    && response.getResult().getOutput().getText() != null) {
                return response.getResult().getOutput().getText();
            }

            return "No pude procesar tu consulta. Por favor, intenta reformular tu pregunta.";

        } catch (Exception e) {
            log.error("Error al comunicarse con Gemini API: {}", e.getMessage());
            throw new RuntimeException("Error al comunicarse con el servicio de IA", e);
        }
    }
}
