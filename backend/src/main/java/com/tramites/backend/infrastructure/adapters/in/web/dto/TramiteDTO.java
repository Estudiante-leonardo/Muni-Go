package com.tramites.backend.infrastructure.adapters.in.web.dto;

import java.util.List;

public class TramiteDTO {
    private Long id;
    private String nombre;
    private String descripcion;
    private Double costo;
    private String tiempoEstimado;
    private String categoria;
    private List<RequisitoDTO> requisitos;

    public TramiteDTO() {
    }

    public TramiteDTO(Long id, String nombre, String descripcion, Double costo, String tiempoEstimado, String categoria, List<RequisitoDTO> requisitos) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.costo = costo;
        this.tiempoEstimado = tiempoEstimado;
        this.categoria = categoria;
        this.requisitos = requisitos;
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

    public Double getCosto() {
        return costo;
    }

    public void setCosto(Double costo) {
        this.costo = costo;
    }

    public String getTiempoEstimado() {
        return tiempoEstimado;
    }

    public void setTiempoEstimado(String tiempoEstimado) {
        this.tiempoEstimado = tiempoEstimado;
    }

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public List<RequisitoDTO> getRequisitos() {
        return requisitos;
    }

    public void setRequisitos(List<RequisitoDTO> requisitos) {
        this.requisitos = requisitos;
    }
}
