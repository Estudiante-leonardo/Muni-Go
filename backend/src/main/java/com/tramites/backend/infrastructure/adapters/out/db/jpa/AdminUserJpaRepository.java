package com.tramites.backend.infrastructure.adapters.out.db.jpa;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AdminUserJpaRepository extends JpaRepository<AdminUserJpaEntity, Long> {
    Optional<AdminUserJpaEntity> findByUsername(String username);
    boolean existsByUsername(String username);
}
