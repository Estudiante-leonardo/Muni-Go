package com.tramites.backend.infrastructure.adapters.out.db.jpa;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TramiteJpaRepository extends JpaRepository<TramiteJpaEntity, Long> {
}
