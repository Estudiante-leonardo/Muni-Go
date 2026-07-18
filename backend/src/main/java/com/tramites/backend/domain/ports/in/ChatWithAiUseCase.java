package com.tramites.backend.domain.ports.in;

/**
 * Puerto de entrada para el caso de uso del chat con IA.
 */
public interface ChatWithAiUseCase {

    /**
     * Procesa un mensaje del usuario y devuelve la respuesta de la IA.
     *
     * @param mensaje   Texto enviado por el usuario
     * @param tramiteId ID del trámite seleccionado (puede ser null si no hay trámite)
     * @return Respuesta generada por la IA
     */
    String chat(String mensaje, Long tramiteId);
}
