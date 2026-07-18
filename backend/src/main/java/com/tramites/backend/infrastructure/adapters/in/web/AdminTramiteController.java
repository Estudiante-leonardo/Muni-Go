package com.tramites.backend.infrastructure.adapters.in.web;

import com.tramites.backend.domain.model.Tramite;
import com.tramites.backend.domain.ports.out.TramiteRepositoryPort;
import com.tramites.backend.infrastructure.config.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/tramites")
public class AdminTramiteController {

    private final TramiteRepositoryPort tramiteRepository;
    private final JwtUtil jwtUtil;

    public AdminTramiteController(TramiteRepositoryPort tramiteRepository, JwtUtil jwtUtil) {
        this.tramiteRepository = tramiteRepository;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping
    public ResponseEntity<?> getTramites(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        String role = jwtUtil.extractRole(token);
        Long muniId = jwtUtil.extractMunicipalidadId(token);

        List<Tramite> tramites;

        if ("SUPER_ADMIN".equals(role)) {
            tramites = tramiteRepository.findAll();
        } else {
            if (muniId == null) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "No tiene municipalidad asignada"));
            }
            tramites = tramiteRepository.findByMunicipalidadId(muniId);
        }

        var result = tramites.stream().map(t -> Map.of(
                "id", t.getId(),
                "nombre", t.getNombre(),
                "descripcion", t.getDescripcion() != null ? t.getDescripcion() : "",
                "costo", t.getCosto(),
                "tiempoEstimado", t.getTiempoEstimado(),
                "categoria", t.getCategoria(),
                "municipalidadId", t.getMunicipalidadId()
        )).collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }
}
