package com.tramites.backend.infrastructure.adapters.out.db.jpa;

import com.tramites.backend.domain.model.Municipalidad;
import com.tramites.backend.domain.ports.out.MunicipalidadRepositoryPort;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Component
@Transactional(readOnly = true)
public class MunicipalidadPostgresAdapter implements MunicipalidadRepositoryPort {
    private final MunicipalidadJpaRepository municipalidadJpaRepository;

    public MunicipalidadPostgresAdapter(MunicipalidadJpaRepository municipalidadJpaRepository) {
        this.municipalidadJpaRepository = municipalidadJpaRepository;
    }

    @Override
    @Cacheable("municipalidades")
    public List<Municipalidad> findAll() {
        return municipalidadJpaRepository.findAll().stream()
                .map(MunicipalidadJpaEntity::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    @org.springframework.cache.annotation.CacheEvict(value = "municipalidades", allEntries = true)
    public Municipalidad save(Municipalidad municipalidad) {
        MunicipalidadJpaEntity entity = new MunicipalidadJpaEntity();
        entity.setNombre(municipalidad.getNombre());
        if (municipalidad.getActivo() != null) {
            entity.setActivo(municipalidad.getActivo());
        } else {
            entity.setActivo(true);
        }
        MunicipalidadJpaEntity saved = municipalidadJpaRepository.save(entity);
        return saved.toDomain();
    }

    @Override
    @Transactional
    @org.springframework.cache.annotation.CacheEvict(value = "municipalidades", allEntries = true)
    public Municipalidad update(Long id, Municipalidad municipalidad) {
        MunicipalidadJpaEntity entity = municipalidadJpaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Municipalidad no encontrada"));
        if (municipalidad.getNombre() != null) {
            entity.setNombre(municipalidad.getNombre());
        }
        if (municipalidad.getActivo() != null) {
            entity.setActivo(municipalidad.getActivo());
        }
        MunicipalidadJpaEntity updated = municipalidadJpaRepository.save(entity);
        return updated.toDomain();
    }

    @Override
    @Transactional
    @org.springframework.cache.annotation.CacheEvict(value = "municipalidades", allEntries = true)
    public void delete(Long id) {
        try {
            municipalidadJpaRepository.deleteById(id);
        } catch (org.springframework.dao.DataIntegrityViolationException e) {
            throw new IllegalArgumentException("No se puede eliminar la municipalidad porque tiene trámites asignados.");
        }
    }
}
