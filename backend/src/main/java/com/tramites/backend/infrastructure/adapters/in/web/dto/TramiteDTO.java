package com.tramites.backend.infrastructure.adapters.in.web.dto;

import java.util.List;

public class TramiteDTO {
    private Long id;
    private String nombre;
    private String descripcion;
    private Double costo;
    private String tiempoEstimado;
    private String categoria;
    private Long municipalidadId;
    private List<RequisitoDTO> requisitos;
    private List<FormatoDTO> formatos;
    private List<PasoDTO> pasos;
    private LugarDTO lugar;

    public TramiteDTO() {
    }

    public TramiteDTO(Long id, String nombre, String descripcion, Double costo, String tiempoEstimado, String categoria, Long municipalidadId, List<RequisitoDTO> requisitos, List<FormatoDTO> formatos, List<PasoDTO> pasos, LugarDTO lugar) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.costo = costo;
        this.tiempoEstimado = tiempoEstimado;
        this.categoria = categoria;
        this.municipalidadId = municipalidadId;
        this.requisitos = requisitos;
        this.formatos = formatos;
        this.pasos = pasos;
        this.lugar = lugar;
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

    public Long getMunicipalidadId() {
        return municipalidadId;
    }

    public void setMunicipalidadId(Long municipalidadId) {
        this.municipalidadId = municipalidadId;
    }

    public List<RequisitoDTO> getRequisitos() {
        return requisitos;
    }

    public void setRequisitos(List<RequisitoDTO> requisitos) {
        this.requisitos = requisitos;
    }

    public List<FormatoDTO> getFormatos() {
        return formatos;
    }

    public void setFormatos(List<FormatoDTO> formatos) {
        this.formatos = formatos;
    }

    public List<PasoDTO> getPasos() {
        return pasos;
    }

    public void setPasos(List<PasoDTO> pasos) {
        this.pasos = pasos;
    }

    public LugarDTO getLugar() {
        return lugar;
    }

    public void setLugar(LugarDTO lugar) {
        this.lugar = lugar;
    }
}
