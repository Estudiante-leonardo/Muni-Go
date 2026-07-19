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

    public MunicipalidadController(GetMunicipalidadesUseCase getMunicipalidadesUseCase,
                                   com.tramites.backend.domain.ports.in.CreateMunicipalidadUseCase createMunicipalidadUseCase,
                                   com.tramites.backend.domain.ports.in.UpdateMunicipalidadUseCase updateMunicipalidadUseCase,
                                   com.tramites.backend.domain.ports.in.DeleteMunicipalidadUseCase deleteMunicipalidadUseCase) {
        this.getMunicipalidadesUseCase = getMunicipalidadesUseCase;
        this.createMunicipalidadUseCase = createMunicipalidadUseCase;
        this.updateMunicipalidadUseCase = updateMunicipalidadUseCase;
        this.deleteMunicipalidadUseCase = deleteMunicipalidadUseCase;
    }

    @GetMapping
    public List<Municipalidad> getMunicipalidades() {
        return getMunicipalidadesUseCase.execute();
    }

    @org.springframework.web.bind.annotation.PostMapping
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
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
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    public org.springframework.http.ResponseEntity<?> updateMunicipalidad(
            @org.springframework.web.bind.annotation.PathVariable Long id,
            @org.springframework.web.bind.annotation.RequestBody com.tramites.backend.infrastructure.adapters.in.web.dto.MunicipalidadRequestDto dto) {
        try {
            Municipalidad updated = updateMunicipalidadUseCase.execute(id, dto.getNombre());
            return org.springframework.http.ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return org.springframework.http.ResponseEntity.badRequest().body(java.util.Map.of("message", e.getMessage()));
        }
    }

    @org.springframework.web.bind.annotation.DeleteMapping("/{id}")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    public org.springframework.http.ResponseEntity<?> deleteMunicipalidad(@org.springframework.web.bind.annotation.PathVariable Long id) {
        try {
            deleteMunicipalidadUseCase.execute(id);
            return org.springframework.http.ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return org.springframework.http.ResponseEntity.badRequest().body(java.util.Map.of("message", e.getMessage()));
        }
    }
}
