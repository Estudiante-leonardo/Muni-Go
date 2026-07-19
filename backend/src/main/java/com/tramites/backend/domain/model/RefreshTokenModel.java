package com.tramites.backend.domain.model;

import java.time.LocalDateTime;

public class RefreshTokenModel {
    private Long id;
    private String token;
    private String username;
    private LocalDateTime expiresAt;
    private LocalDateTime createdAt;
    private boolean revoked;

    public RefreshTokenModel() {}

    public RefreshTokenModel(Long id, String token, String username, LocalDateTime expiresAt,
                             LocalDateTime createdAt, boolean revoked) {
        this.id = id;
        this.token = token;
        this.username = username;
        this.expiresAt = expiresAt;
        this.createdAt = createdAt;
        this.revoked = revoked;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public LocalDateTime getExpiresAt() { return expiresAt; }
    public void setExpiresAt(LocalDateTime expiresAt) { this.expiresAt = expiresAt; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public boolean isRevoked() { return revoked; }
    public void setRevoked(boolean revoked) { this.revoked = revoked; }

    public boolean isExpired() {
        return LocalDateTime.now().isAfter(expiresAt);
    }
}
