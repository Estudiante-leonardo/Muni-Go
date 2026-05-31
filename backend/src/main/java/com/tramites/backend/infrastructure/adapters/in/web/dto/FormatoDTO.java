package com.tramites.backend.infrastructure.adapters.in.web.dto;

public class FormatoDTO {
    private Long id;
    private String nombre;
    private String descripcion;
    private String urlDescarga;

    public FormatoDTO() {}

    public FormatoDTO(Long id, String nombre, String descripcion, String urlDescarga) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.urlDescarga = urlDescarga;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getUrlDescarga() {
        return urlDescarga;
    }

    public void setUrlDescarga(String urlDescarga) {
        this.urlDescarga = urlDescarga;
    }
}
