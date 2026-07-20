package com.tramites.backend.infrastructure.adapters.in.web;

import com.tramites.backend.domain.model.Tramite;
import com.tramites.backend.domain.ports.out.TramiteRepositoryPort;
import com.tramites.backend.domain.ports.out.AdminUserRepositoryPort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/tramites")
public class AdminTramiteController {

    private final TramiteRepositoryPort tramiteRepository;
    private final AdminUserRepositoryPort adminUserRepository;

    public AdminTramiteController(TramiteRepositoryPort tramiteRepository,
                                  AdminUserRepositoryPort adminUserRepository) {
        this.tramiteRepository = tramiteRepository;
        this.adminUserRepository = adminUserRepository;
    }

    @GetMapping
    public ResponseEntity<?> getTramites() {
        String role = getCurrentRole();
        Long muniId = getCurrentMunicipalidadId();

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
    public ResponseEntity<?> getTramiteById(@PathVariable Long id) {
        String role = getCurrentRole();
        Long muniId = getCurrentMunicipalidadId();

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
    public ResponseEntity<?> createTramite(@RequestBody Tramite request) {
        String role = getCurrentRole();
        Long muniId = getCurrentMunicipalidadId();

        if (!"SUPER_ADMIN".equals(role)) {
            request.setMunicipalidadId(muniId);
        } else if (request.getMunicipalidadId() == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Debe especificar la municipalidad"));
        }

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
    public ResponseEntity<?> updateTramite(@PathVariable Long id, @RequestBody Tramite request) {
        String role = getCurrentRole();
        Long muniId = getCurrentMunicipalidadId();

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
    public ResponseEntity<?> deleteTramite(@PathVariable Long id) {
        String role = getCurrentRole();
        Long muniId = getCurrentMunicipalidadId();

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

    private String getCurrentRole() {
        Authentication auth = org.springframework.security.core.context.SecurityContextHolder
                .getContext().getAuthentication();
        if (auth == null) return null;
        return auth.getAuthorities().stream()
                .findFirst()
                .map(a -> a.getAuthority())
                .map(r -> r.replace("ROLE_", ""))
                .orElse(null);
    }

    private Long getCurrentMunicipalidadId() {
        Authentication auth = org.springframework.security.core.context.SecurityContextHolder
                .getContext().getAuthentication();
        if (auth == null || auth.getPrincipal() == null) return null;
        String username = auth.getPrincipal().toString();
        return adminUserRepository.findByUsername(username)
                .map(u -> u.getMunicipalidadId())
                .orElse(null);
    }
}
