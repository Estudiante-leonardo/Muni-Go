package com.tramites.backend.infrastructure.adapters.in.web;

import com.tramites.backend.domain.model.Tramite;
import com.tramites.backend.domain.ports.out.TramiteRepositoryPort;
import com.tramites.backend.infrastructure.config.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

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

        return ResponseEntity.ok(tramites);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTramiteById(@PathVariable Long id, @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        String role = jwtUtil.extractRole(token);
        Long muniId = jwtUtil.extractMunicipalidadId(token);

        Optional<Tramite> op = tramiteRepository.findById(id);
        if (op.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Tramite t = op.get();
        if (!"SUPER_ADMIN".equals(role) && !t.getMunicipalidadId().equals(muniId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "No tiene permisos para ver este trámite"));
        }

        return ResponseEntity.ok(t);
    }

    @PostMapping
    public ResponseEntity<?> createTramite(@RequestBody Tramite request, @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        String role = jwtUtil.extractRole(token);
        Long muniId = jwtUtil.extractMunicipalidadId(token);

        if (!"SUPER_ADMIN".equals(role)) {
            request.setMunicipalidadId(muniId);
        } else if (request.getMunicipalidadId() == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Debe especificar la municipalidad"));
        }

        // Set parent relationship references correctly
        if (request.getRequisitos() != null) {
            request.getRequisitos().forEach(r -> r.setId(null));
        }
        if (request.getPasos() != null) {
            request.getPasos().forEach(p -> p.setId(null));
        }
        if (request.getFormatos() != null) {
            request.getFormatos().forEach(f -> f.setId(null));
        }
        if (request.getLugar() != null) {
            request.getLugar().setId(null);
        }

        Tramite saved = tramiteRepository.save(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTramite(@PathVariable Long id, @RequestBody Tramite request, @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        String role = jwtUtil.extractRole(token);
        Long muniId = jwtUtil.extractMunicipalidadId(token);

        Optional<Tramite> op = tramiteRepository.findById(id);
        if (op.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Tramite existing = op.get();
        if (!"SUPER_ADMIN".equals(role) && !existing.getMunicipalidadId().equals(muniId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "No tiene permisos para modificar este trámite"));
        }

        request.setId(id);
        if (!"SUPER_ADMIN".equals(role)) {
            request.setMunicipalidadId(muniId);
        } else if (request.getMunicipalidadId() == null) {
            request.setMunicipalidadId(existing.getMunicipalidadId());
        }

        Tramite saved = tramiteRepository.save(request);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTramite(@PathVariable Long id, @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        String role = jwtUtil.extractRole(token);
        Long muniId = jwtUtil.extractMunicipalidadId(token);

        Optional<Tramite> op = tramiteRepository.findById(id);
        if (op.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Tramite existing = op.get();
        if (!"SUPER_ADMIN".equals(role) && !existing.getMunicipalidadId().equals(muniId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "No tiene permisos para eliminar este trámite"));
        }

        tramiteRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Trámite eliminado correctamente"));
    }
}
