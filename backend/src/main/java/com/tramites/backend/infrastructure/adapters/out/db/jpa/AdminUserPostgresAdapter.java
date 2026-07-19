package com.tramites.backend.infrastructure.adapters.out.db.jpa;

import com.tramites.backend.domain.model.AdminUser;
import com.tramites.backend.domain.ports.out.AdminUserRepositoryPort;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class AdminUserPostgresAdapter implements AdminUserRepositoryPort {

    private final AdminUserJpaRepository repository;

    public AdminUserPostgresAdapter(AdminUserJpaRepository repository) {
        this.repository = repository;
    }

    @Override
    public Optional<AdminUser> findById(Long id) {
        return repository.findById(id).map(this::toDomain);
    }

    @Override
    public Optional<AdminUser> findByUsername(String username) {
        return repository.findByUsername(username).map(this::toDomain);
    }

    @Override
    public List<AdminUser> findAll() {
        return repository.findAll().stream().map(this::toDomain).collect(Collectors.toList());
    }

    @Override
    public AdminUser save(AdminUser adminUser) {
        AdminUserJpaEntity entity = toEntity(adminUser);
        return toDomain(repository.save(entity));
    }

    @Override
    public void deleteById(Long id) {
        repository.deleteById(id);
    }

    @Override
    public boolean existsByUsername(String username) {
        return repository.existsByUsername(username);
    }

    private AdminUser toDomain(AdminUserJpaEntity entity) {
        return new AdminUser(
                entity.getId(), entity.getUsername(), entity.getPasswordHash(),
                entity.getNombreCompleto(), entity.getRol(),
                entity.getMunicipalidadId(), entity.getActivo()
        );
    }

    private AdminUserJpaEntity toEntity(AdminUser domain) {
        AdminUserJpaEntity entity = new AdminUserJpaEntity();
        entity.setId(domain.getId());
        entity.setUsername(domain.getUsername());
        entity.setPasswordHash(domain.getPasswordHash());
        entity.setNombreCompleto(domain.getNombreCompleto());
        entity.setRol(domain.getRol());
        entity.setMunicipalidadId(domain.getMunicipalidadId());
        entity.setActivo(domain.getActivo() != null ? domain.getActivo() : true);
        return entity;
    }
}
