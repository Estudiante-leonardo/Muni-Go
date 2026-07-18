package com.tramites.backend.domain.ports.out;

import com.tramites.backend.domain.model.AdminUser;

import java.util.List;
import java.util.Optional;

public interface AdminUserRepositoryPort {
    Optional<AdminUser> findByUsername(String username);
    List<AdminUser> findAll();
    AdminUser save(AdminUser adminUser);
    void deleteById(Long id);
    boolean existsByUsername(String username);
}
