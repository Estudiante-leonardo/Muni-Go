package com.tramites.backend.infrastructure.adapters.in.web;

import com.tramites.backend.domain.model.Tramite;
import com.tramites.backend.domain.ports.out.TramiteRepositoryPort;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tramites")
public class TramiteResumenController {

    private final ChatClient chatClient;
    private final TramiteRepositoryPort tramiteRepository;

    public TramiteResumenController(ChatModel chatModel, TramiteRepositoryPort tramiteRepository) {
        this.chatClient = ChatClient.builder(chatModel).build();
        this.tramiteRepository = tramiteRepository;
    }

    @GetMapping("/{id}/resumen-ia")
    public ResponseEntity<Map<String, String>> resumenIa(@PathVariable Long id) {
        Optional<Tramite> tramiteOpt = tramiteRepository.findById(id);
        if (tramiteOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Tramite t = tramiteOpt.get();
        String contexto = buildContexto(t);

        String resumen = chatClient.prompt()
                .system("Eres un asistente que genera resúmenes cortos y claros de trámites municipales. " +
                        "Responde en máximo 2 oraciones, en español, de forma directa y útil.")
                .user("Genera un resumen breve de este trámite:\n" + contexto)
                .call()
                .content();

        return ResponseEntity.ok(Map.of("resumen", resumen != null ? resumen : "Resumen no disponible."));
    }

    private String buildContexto(Tramite t) {
        StringBuilder ctx = new StringBuilder();
        ctx.append("Nombre: ").append(t.getNombre()).append("\n");
        ctx.append("Descripción: ").append(t.getDescripcion()).append("\n");
        ctx.append("Costo: S/ ").append(t.getCosto()).append("\n");
        ctx.append("Tiempo estimado: ").append(t.getTiempoEstimado()).append("\n");

        if (t.getRequisitos() != null && !t.getRequisitos().isEmpty()) {
            ctx.append("Requisitos: ");
            ctx.append(t.getRequisitos().stream()
                    .map(r -> r.getDescripcion())
                    .collect(Collectors.joining("; ")));
            ctx.append("\n");
        }

        return ctx.toString();
    }
}
