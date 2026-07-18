package com.tramites.backend.domain.ports.out;

/**
 * Puerto de salida para comunicarse con un servicio de IA externo.
 */
public interface AiChatPort {

    /**
     * Envía un mensaje al modelo de IA con un system prompt de contexto.
     *
     * @param systemPrompt Instrucciones del sistema para la IA
     * @param userMessage  Mensaje del usuario
     * @return Respuesta generada por la IA
     */
    String enviarMensaje(String systemPrompt, String userMessage);
}
