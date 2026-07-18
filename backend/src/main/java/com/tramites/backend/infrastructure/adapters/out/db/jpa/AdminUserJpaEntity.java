package com.tramites.backend.infrastructure.adapters.out.db.jpa;

import jakarta.persistence.*;

@Entity
@Table(name = "admin_users")
public class AdminUserJpaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(name = "nombre_completo", nullable = false)
    private String nombreCompleto;

    @Column(nullable = false)
    private String rol;

    @Column(name = "municipalidad_id")
    private Long municipalidadId;

    @Column(nullable = false)
    private Boolean activo = true;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }

    public String getNombreCompleto() { return nombreCompleto; }
    public void setNombreCompleto(String nombreCompleto) { this.nombreCompleto = nombreCompleto; }

    public String getRol() { return rol; }
    public void setRol(String rol) { this.rol = rol; }

    public Long getMunicipalidadId() { return municipalidadId; }
    public void setMunicipalidadId(Long municipalidadId) { this.municipalidadId = municipalidadId; }

    public Boolean getActivo() { return activo; }
    public void setActivo(Boolean activo) { this.activo = activo; }
}
