package com.tramites.backend.infrastructure.adapters.out.db.jpa;

import com.tramites.backend.domain.model.Municipalidad;
import com.tramites.backend.domain.ports.out.MunicipalidadRepositoryPort;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class MunicipalidadPostgresAdapter implements MunicipalidadRepositoryPort {
    private final MunicipalidadJpaRepository municipalidadJpaRepository;

    public MunicipalidadPostgresAdapter(MunicipalidadJpaRepository municipalidadJpaRepository) {
        this.municipalidadJpaRepository = municipalidadJpaRepository;
    }

    @Override
    public List<Municipalidad> findAll() {
        return municipalidadJpaRepository.findAll().stream()
                .map(MunicipalidadJpaEntity::toDomain)
                .collect(Collectors.toList());
    }
}
