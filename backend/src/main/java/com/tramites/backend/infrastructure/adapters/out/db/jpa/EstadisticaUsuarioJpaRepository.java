package com.tramites.backend.infrastructure.adapters.out.db.jpa;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EstadisticaUsuarioJpaRepository extends JpaRepository<EstadisticaUsuarioJpaEntity, Long> {
    List<EstadisticaUsuarioJpaEntity> findByMunicipalidadIdOrderByAnioAscMesAsc(Long municipalidadId);
}
