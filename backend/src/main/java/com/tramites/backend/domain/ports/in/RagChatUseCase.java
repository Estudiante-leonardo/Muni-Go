package com.tramites.backend.domain.ports.in;

public interface RagChatUseCase {
    String chat(String mensaje, Long tramiteId, String sessionId, String municipalidadNombre);
}
