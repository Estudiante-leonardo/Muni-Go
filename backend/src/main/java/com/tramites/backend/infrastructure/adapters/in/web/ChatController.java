package com.tramites.backend.infrastructure.adapters.in.web;

import com.tramites.backend.domain.ports.in.ChatWithAiUseCase;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatWithAiUseCase chatWithAiUseCase;

    public ChatController(ChatWithAiUseCase chatWithAiUseCase) {
        this.chatWithAiUseCase = chatWithAiUseCase;
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> chat(@RequestBody Map<String, Object> request) {
        String mensaje = (String) request.get("mensaje");
        Long tramiteId = null;

        if (request.containsKey("tramiteId") && request.get("tramiteId") != null) {
            tramiteId = ((Number) request.get("tramiteId")).longValue();
        }

        if (mensaje == null || mensaje.isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("respuesta", "Por favor, escribe un mensaje."));
        }

        String respuesta = chatWithAiUseCase.chat(mensaje, tramiteId);
        return ResponseEntity.ok(Map.of("respuesta", respuesta));
    }
}
