package com.tramites.backend.infrastructure.adapters.out.db.jpa;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EstadisticaConsultaJpaRepository extends JpaRepository<EstadisticaConsultaJpaEntity, Long> {
    List<EstadisticaConsultaJpaEntity> findByMunicipalidadIdOrderByAnioAscMesAsc(Long municipalidadId);
}
