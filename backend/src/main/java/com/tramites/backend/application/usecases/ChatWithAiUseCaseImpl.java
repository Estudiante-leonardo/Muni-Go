package com.tramites.backend.application.usecases;

import com.tramites.backend.domain.model.Tramite;
import com.tramites.backend.domain.ports.in.ChatWithAiUseCase;
import com.tramites.backend.domain.ports.out.AiChatPort;
import com.tramites.backend.domain.ports.out.TramiteRepositoryPort;

import java.util.stream.Collectors;

public class ChatWithAiUseCaseImpl implements ChatWithAiUseCase {

    private final AiChatPort aiChatPort;
    private final TramiteRepositoryPort tramiteRepositoryPort;

    private static final String SYSTEM_PROMPT_BASE =
            "Eres \"Manuelito\", el Asistente Municipal IA de la Municipalidad de Carabayllo. " +
            "REGLAS ESTRICTAS:\n" +
            "1. SOLO respondes preguntas sobre trámites y servicios de la Municipalidad.\n" +
            "2. Si preguntan algo fuera de tema (deportes, política, tareas, etc.), responde: " +
            "\"Lo siento, solo puedo ayudarte con trámites y consultas de la Municipalidad. ¿Tienes alguna duda sobre un trámite?\"\n" +
            "3. Responde de forma breve, clara y amigable. Máximo 3-4 oraciones.\n" +
            "4. Siempre menciona costos en Soles (S/).\n" +
            "5. No inventes información. Si no sabes algo, sugiere acercarse a mesa de partes.\n";

    public ChatWithAiUseCaseImpl(AiChatPort aiChatPort, TramiteRepositoryPort tramiteRepositoryPort) {
        this.aiChatPort = aiChatPort;
        this.tramiteRepositoryPort = tramiteRepositoryPort;
    }

    @Override
    public String chat(String mensaje, Long tramiteId) {
        String systemPrompt = SYSTEM_PROMPT_BASE;

        // Si hay un trámite seleccionado, inyectar su contexto al prompt
        if (tramiteId != null) {
            var tramiteOpt = tramiteRepositoryPort.findById(tramiteId);
            if (tramiteOpt.isPresent()) {
                systemPrompt += buildTramiteContext(tramiteOpt.get());
            }
        }

        try {
            return aiChatPort.enviarMensaje(systemPrompt, mensaje);
        } catch (Exception e) {
            return "Lo siento, estoy teniendo dificultades técnicas en este momento. " +
                   "Por favor, intenta de nuevo en unos segundos o acércate a mesa de partes para ayuda presencial.";
        }
    }

    private String buildTramiteContext(Tramite tramite) {
        StringBuilder ctx = new StringBuilder();
        ctx.append("\n\nINFORMACIÓN DEL TRÁMITE SELECCIONADO:\n");
        ctx.append("- Nombre: ").append(tramite.getNombre()).append("\n");
        ctx.append("- Descripción: ").append(tramite.getDescripcion()).append("\n");
        ctx.append("- Costo: S/ ").append(tramite.getCosto()).append("\n");
        ctx.append("- Tiempo estimado: ").append(tramite.getTiempoEstimado()).append("\n");
        ctx.append("- Categoría: ").append(tramite.getCategoria()).append("\n");

        if (tramite.getRequisitos() != null && !tramite.getRequisitos().isEmpty()) {
            ctx.append("- Requisitos: ");
            ctx.append(tramite.getRequisitos().stream()
                    .map(r -> r.getDescripcion())
                    .collect(Collectors.joining("; ")));
            ctx.append("\n");
        }

        if (tramite.getPasos() != null && !tramite.getPasos().isEmpty()) {
            ctx.append("- Pasos: ");
            ctx.append(tramite.getPasos().stream()
                    .map(p -> p.getNumero() + ". " + p.getTitulo())
                    .collect(Collectors.joining("; ")));
            ctx.append("\n");
        }

        if (tramite.getLugar() != null) {
            ctx.append("- Lugar: ").append(tramite.getLugar().getNombre())
               .append(", ").append(tramite.getLugar().getDireccion())
               .append(" (").append(tramite.getLugar().getHorario()).append(")\n");
        }

        ctx.append("\nUsa EXCLUSIVAMENTE esta información para responder sobre este trámite.");
        return ctx.toString();
    }
}
