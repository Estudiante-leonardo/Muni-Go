package com.tramites.backend.infrastructure.adapters.out.db.jpa;

import com.tramites.backend.domain.model.RefreshTokenModel;
import com.tramites.backend.domain.ports.out.RefreshTokenRepositoryPort;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class RefreshTokenPostgresAdapter implements RefreshTokenRepositoryPort {

    private final RefreshTokenJpaRepository repository;

    public RefreshTokenPostgresAdapter(RefreshTokenJpaRepository repository) {
        this.repository = repository;
    }

    @Override
    public Optional<RefreshTokenModel> findByToken(String token) {
        return repository.findByToken(token).map(this::toDomain);
    }

    @Override
    public RefreshTokenModel save(RefreshTokenModel model) {
        return toDomain(repository.save(toEntity(model)));
    }

    @Override
    public void deleteByUsername(String username) {
        repository.deleteByUsername(username);
    }

    private RefreshTokenModel toDomain(RefreshTokenJpaEntity entity) {
        return new RefreshTokenModel(
                entity.getId(), entity.getToken(), entity.getUsername(),
                entity.getExpiresAt(), entity.getCreatedAt(), entity.isRevoked()
        );
    }

    private RefreshTokenJpaEntity toEntity(RefreshTokenModel model) {
        RefreshTokenJpaEntity entity = new RefreshTokenJpaEntity();
        entity.setId(model.getId());
        entity.setToken(model.getToken());
        entity.setUsername(model.getUsername());
        entity.setExpiresAt(model.getExpiresAt());
        entity.setCreatedAt(model.getCreatedAt());
        entity.setRevoked(model.isRevoked());
        return entity;
    }
}
