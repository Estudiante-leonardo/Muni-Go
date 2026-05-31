package com.tramites.backend.infrastructure.adapters.in.web.dto;

public class PasoDTO {
    private Long id;
    private Integer numero;
    private String titulo;
    private String descripcion;

    public PasoDTO() {}

    public PasoDTO(Long id, Integer numero, String titulo, String descripcion) {
        this.id = id;
        this.numero = numero;
        this.titulo = titulo;
        this.descripcion = descripcion;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getNumero() {
        return numero;
    }

    public void setNumero(Integer numero) {
        this.numero = numero;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }
}
