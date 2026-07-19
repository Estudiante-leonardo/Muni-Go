package com.tramites.backend.domain.ports.out;

import com.tramites.backend.domain.model.RefreshTokenModel;

import java.util.Optional;

public interface RefreshTokenRepositoryPort {
    Optional<RefreshTokenModel> findByToken(String token);
    RefreshTokenModel save(RefreshTokenModel refreshToken);
    void deleteByUsername(String username);
}
