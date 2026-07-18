package com.tramites.backend.infrastructure.adapters.out.db.jpa;

import com.tramites.backend.domain.model.Requisito;
import com.tramites.backend.domain.model.Tramite;
import com.tramites.backend.domain.model.Formato;
import com.tramites.backend.domain.model.Paso;
import com.tramites.backend.domain.model.Lugar;
import com.tramites.backend.domain.ports.out.TramiteRepositoryPort;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
@Transactional(readOnly = true)
public class TramitePostgresAdapter implements TramiteRepositoryPort {
    private final TramiteJpaRepository tramiteJpaRepository;

    public TramitePostgresAdapter(TramiteJpaRepository tramiteJpaRepository) {
        this.tramiteJpaRepository = tramiteJpaRepository;
    }

    @Override
    @Cacheable(value = "tramites", unless = "#result.isEmpty()")
    public List<Tramite> findAll() {
        return tramiteJpaRepository.findAll().stream()
                .map(this::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    @Cacheable(value = "tramites", key = "#municipalidadId", unless = "#result.isEmpty()")
    public List<Tramite> findByMunicipalidadId(Long municipalidadId) {
        return tramiteJpaRepository.findByMunicipalidadId(municipalidadId).stream()
                .map(this::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<Tramite> findById(Long id) {
        return tramiteJpaRepository.findById(id).map(this::toDomain);
    }

    private Tramite toDomain(TramiteJpaEntity entity) {
        if (entity == null) {
            return null;
        }
        
        List<Requisito> requirements = new ArrayList<>();
        if (entity.getRequisitos() != null) {
            requirements = entity.getRequisitos().stream()
                    .map(reqEntity -> new Requisito(reqEntity.getId(), reqEntity.getDescripcion()))
                    .collect(Collectors.toList());
        }

        List<Formato> formatos = new ArrayList<>();
        if (entity.getFormatos() != null) {
            formatos = entity.getFormatos().stream()
                    .map(fmtEntity -> new Formato(fmtEntity.getId(), fmtEntity.getNombre(), fmtEntity.getDescripcion(), fmtEntity.getUrlDescarga()))
                    .collect(Collectors.toList());
        }

        List<Paso> pasos = new ArrayList<>();
        if (entity.getPasos() != null) {
            pasos = entity.getPasos().stream()
                    .map(pasoEntity -> new Paso(pasoEntity.getId(), pasoEntity.getNumero(), pasoEntity.getTitulo(), pasoEntity.getDescripcion()))
                    .collect(Collectors.toList());
        }

        Lugar lugar = null;
        if (entity.getLugar() != null) {
            lugar = new Lugar(entity.getLugar().getId(), entity.getLugar().getNombre(), entity.getLugar().getDireccion(), entity.getLugar().getHorario());
        }

        return new Tramite(
                entity.getId(),
                entity.getNombre(),
                entity.getDescripcion(),
                entity.getCosto() != null ? entity.getCosto() : BigDecimal.ZERO,
                entity.getTiempoEstimado(),
                entity.getCategoria(),
                entity.getMunicipalidadId(),
                requirements,
                formatos,
                pasos,
                lugar
        );
    }
}
