package com.tramites.backend.domain.ports.in;

import com.tramites.backend.domain.model.ChatResponseDto;

public interface RagChatUseCase {
    ChatResponseDto chat(String mensaje, Long tramiteId, String sessionId, String municipalidadNombre, Long municipalidadId);
}
