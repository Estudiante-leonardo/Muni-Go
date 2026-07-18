package com.tramites.backend.infrastructure.adapters.out.ai;

import com.tramites.backend.domain.ports.out.AiChatPort;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

@Component
public class GeminiAiAdapter implements AiChatPort {

    private static final Logger log = LoggerFactory.getLogger(GeminiAiAdapter.class);

    private final String apiKey;
    private final String model;
    private final RestClient restClient;

    public GeminiAiAdapter(
            @Value("${gemini.api.key}") String apiKey,
            @Value("${gemini.api.model}") String model) {
        this.apiKey = apiKey;
        this.model = model;
        this.restClient = RestClient.builder()
                .baseUrl("https://generativelanguage.googleapis.com")
                .build();
    }

    @Override
    public String enviarMensaje(String systemPrompt, String userMessage) {
        String url = "/v1beta/models/" + model + ":generateContent?key=" + apiKey;

        // Construir el body de la petición según la API de Gemini
        Map<String, Object> requestBody = Map.of(
                "system_instruction", Map.of(
                        "parts", List.of(Map.of("text", systemPrompt))
                ),
                "contents", List.of(
                        Map.of("parts", List.of(Map.of("text", userMessage)))
                ),
                "generationConfig", Map.of(
                        "maxOutputTokens", 200,
                        "temperature", 0.7
                )
        );

        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> response = restClient.post()
                    .uri(url)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(requestBody)
                    .retrieve()
                    .body(Map.class);

            // Extraer el texto de la respuesta de Gemini
            if (response != null && response.containsKey("candidates")) {
                @SuppressWarnings("unchecked")
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.get("candidates");
                if (candidates != null && !candidates.isEmpty()) {
                    @SuppressWarnings("unchecked")
                    Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
                    if (content != null && content.containsKey("parts")) {
                        @SuppressWarnings("unchecked")
                        List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
                        if (parts != null && !parts.isEmpty()) {
                            return (String) parts.get(0).get("text");
                        }
                    }
                }
            }

            return "No pude procesar tu consulta. Por favor, intenta reformular tu pregunta.";

        } catch (Exception e) {
            log.error("Error al comunicarse con Gemini API: {}", e.getMessage());
            throw new RuntimeException("Error al comunicarse con el servicio de IA", e);
        }
    }
}
