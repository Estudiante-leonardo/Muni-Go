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
}
