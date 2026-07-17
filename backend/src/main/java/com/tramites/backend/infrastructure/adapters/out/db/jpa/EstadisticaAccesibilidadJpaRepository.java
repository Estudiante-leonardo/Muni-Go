package com.tramites.backend.infrastructure.adapters.out.db.jpa;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EstadisticaAccesibilidadJpaRepository extends JpaRepository<EstadisticaAccesibilidadJpaEntity, Long> {
    List<EstadisticaAccesibilidadJpaEntity> findByMunicipalidadId(Long municipalidadId);
}
