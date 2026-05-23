package com.tramites.backend.infrastructure.adapters.in.web.dto;

public class RequisitoDTO {
    private Long id;
    private String descripcion;

    public RequisitoDTO() {
    }

    public RequisitoDTO(Long id, String descripcion) {
        this.id = id;
        this.descripcion = descripcion;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }
}
