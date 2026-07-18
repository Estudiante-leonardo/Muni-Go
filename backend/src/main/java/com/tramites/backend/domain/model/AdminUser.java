package com.tramites.backend.domain.model;

public class AdminUser {

    private Long id;
    private String username;
    private String passwordHash;
    private String nombreCompleto;
    private String rol;
    private Long municipalidadId;
    private Boolean activo;

    public AdminUser() {}

    public AdminUser(Long id, String username, String passwordHash, String nombreCompleto,
                     String rol, Long municipalidadId, Boolean activo) {
        this.id = id;
        this.username = username;
        this.passwordHash = passwordHash;
        this.nombreCompleto = nombreCompleto;
        this.rol = rol;
        this.municipalidadId = municipalidadId;
        this.activo = activo;
    }

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
