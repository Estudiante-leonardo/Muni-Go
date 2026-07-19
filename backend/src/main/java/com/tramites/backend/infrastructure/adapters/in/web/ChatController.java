package com.tramites.backend.infrastructure.adapters.in.web;

import com.tramites.backend.domain.model.ChatResponseDto;
import com.tramites.backend.domain.ports.in.RagChatUseCase;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final RagChatUseCase ragChatUseCase;

    public ChatController(RagChatUseCase ragChatUseCase) {
        this.ragChatUseCase = ragChatUseCase;
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> chat(@RequestBody Map<String, Object> request) {
        String mensaje = (String) request.get("mensaje");
        Long tramiteId = null;
        String sessionId = (String) request.get("sessionId");

        if (request.containsKey("tramiteId") && request.get("tramiteId") != null) {
            tramiteId = ((Number) request.get("tramiteId")).longValue();
        }

        String municipalidadNombre = (String) request.get("municipalidadNombre");
        Long municipalidadId = null;
        if (request.containsKey("municipalidadId") && request.get("municipalidadId") != null) {
            municipalidadId = ((Number) request.get("municipalidadId")).longValue();
        }

        if (mensaje == null || mensaje.isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("respuesta", "Por favor, escribe un mensaje."));
        }

        ChatResponseDto dto = ragChatUseCase.chat(mensaje, tramiteId, sessionId, municipalidadNombre, municipalidadId);
        
        if (dto.getTramiteSugeridoId() != null) {
            return ResponseEntity.ok(Map.of(
                    "respuesta", dto.getRespuesta(),
                    "tramiteSugerido", Map.of(
                            "id", dto.getTramiteSugeridoId(),
                            "nombre", dto.getTramiteSugeridoNombre() != null ? dto.getTramiteSugeridoNombre() : "Ver trámite sugerido"
                    )
            ));
        }
        
        return ResponseEntity.ok(Map.of("respuesta", dto.getRespuesta()));
    }
}
