package com.tramites.backend.infrastructure.adapters.in.web;

import com.tramites.backend.domain.model.Municipalidad;
import com.tramites.backend.domain.ports.in.GetMunicipalidadesUseCase;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/municipalidades")
public class MunicipalidadController {
    private final GetMunicipalidadesUseCase getMunicipalidadesUseCase;
    private final com.tramites.backend.domain.ports.in.CreateMunicipalidadUseCase createMunicipalidadUseCase;
    private final com.tramites.backend.domain.ports.in.UpdateMunicipalidadUseCase updateMunicipalidadUseCase;
    private final com.tramites.backend.domain.ports.in.DeleteMunicipalidadUseCase deleteMunicipalidadUseCase;
    private final com.tramites.backend.domain.ports.out.AdminUserRepositoryPort adminUserRepository;

    public MunicipalidadController(GetMunicipalidadesUseCase getMunicipalidadesUseCase,
                                   com.tramites.backend.domain.ports.in.CreateMunicipalidadUseCase createMunicipalidadUseCase,
                                   com.tramites.backend.domain.ports.in.UpdateMunicipalidadUseCase updateMunicipalidadUseCase,
                                   com.tramites.backend.domain.ports.in.DeleteMunicipalidadUseCase deleteMunicipalidadUseCase,
                                   com.tramites.backend.domain.ports.out.AdminUserRepositoryPort adminUserRepository) {
        this.getMunicipalidadesUseCase = getMunicipalidadesUseCase;
        this.createMunicipalidadUseCase = createMunicipalidadUseCase;
        this.updateMunicipalidadUseCase = updateMunicipalidadUseCase;
        this.deleteMunicipalidadUseCase = deleteMunicipalidadUseCase;
        this.adminUserRepository = adminUserRepository;
    }

    @GetMapping
    public List<Municipalidad> getMunicipalidades(
            @org.springframework.web.bind.annotation.RequestParam(required = false, defaultValue = "false") boolean soloActivos) {
        List<Municipalidad> todas = getMunicipalidadesUseCase.execute();
        if (soloActivos) {
            return todas.stream()
                    .filter(m -> m.getActivo() != null && m.getActivo())
                    .collect(java.util.stream.Collectors.toList());
        }
        return todas;
    }

    @org.springframework.web.bind.annotation.PostMapping
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('SUPER_ADMIN')")
    public org.springframework.http.ResponseEntity<?> createMunicipalidad(
            @org.springframework.web.bind.annotation.RequestBody com.tramites.backend.infrastructure.adapters.in.web.dto.MunicipalidadRequestDto dto) {
        try {
            Municipalidad created = createMunicipalidadUseCase.execute(dto.getNombre());
            return org.springframework.http.ResponseEntity.ok(created);
        } catch (IllegalArgumentException e) {
            return org.springframework.http.ResponseEntity.badRequest().body(java.util.Map.of("message", e.getMessage()));
        }
    }

    @org.springframework.web.bind.annotation.PutMapping("/{id}")
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN_MUNICIPAL')")
    public org.springframework.http.ResponseEntity<?> updateMunicipalidad(
            @org.springframework.web.bind.annotation.PathVariable Long id,
            @org.springframework.web.bind.annotation.RequestBody com.tramites.backend.infrastructure.adapters.in.web.dto.MunicipalidadRequestDto dto) {
        org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        boolean isSuperAdmin = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_SUPER_ADMIN"));
        
        if (!isSuperAdmin) {
            if (dto.getActivo() != null) {
                return org.springframework.http.ResponseEntity.status(org.springframework.http.HttpStatus.FORBIDDEN)
                        .body(java.util.Map.of("message", "Solo los super administradores pueden habilitar o deshabilitar una municipalidad"));
            }

            String username = auth.getName();
            Long userMuniId = adminUserRepository.findByUsername(username)
                    .map(u -> u.getMunicipalidadId())
                    .orElse(null);
            
            if (userMuniId == null || !userMuniId.equals(id)) {
                return org.springframework.http.ResponseEntity.status(org.springframework.http.HttpStatus.FORBIDDEN)
                        .body(java.util.Map.of("message", "No tiene permisos para modificar esta municipalidad"));
            }
        }

        try {
            Municipalidad updated = updateMunicipalidadUseCase.execute(id, dto.getNombre(), dto.getActivo());
            return org.springframework.http.ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return org.springframework.http.ResponseEntity.badRequest().body(java.util.Map.of("message", e.getMessage()));
        }
    }

    @org.springframework.web.bind.annotation.DeleteMapping("/{id}")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('SUPER_ADMIN')")
    public org.springframework.http.ResponseEntity<?> deleteMunicipalidad(@org.springframework.web.bind.annotation.PathVariable Long id) {
        try {
            deleteMunicipalidadUseCase.execute(id);
            return org.springframework.http.ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return org.springframework.http.ResponseEntity.badRequest().body(java.util.Map.of("message", e.getMessage()));
        }
    }
}
