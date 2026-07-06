package com.tramites.backend.domain.model;

import java.math.BigDecimal;
import java.util.List;

public class Tramite {
    private Long id;
    private String nombre;
    private String descripcion;
    private BigDecimal costo;
    private String tiempoEstimado;
    private String categoria;
    private Long municipalidadId;
    private List<Requisito> requisitos;
    private List<Formato> formatos;
    private List<Paso> pasos;
    private Lugar lugar;

    public Tramite() {
    }

    public Tramite(Long id, String nombre, String descripcion, BigDecimal costo, String tiempoEstimado, String categoria, Long municipalidadId, List<Requisito> requisitos, List<Formato> formatos, List<Paso> pasos, Lugar lugar) {
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

    public BigDecimal getCosto() {
        return costo;
    }

    public void setCosto(BigDecimal costo) {
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

    public List<Requisito> getRequisitos() {
        return requisitos;
    }

    public void setRequisitos(List<Requisito> requisitos) {
        this.requisitos = requisitos;
    }

    public List<Formato> getFormatos() {
        return formatos;
    }

    public void setFormatos(List<Formato> formatos) {
        this.formatos = formatos;
    }

    public List<Paso> getPasos() {
        return pasos;
    }

    public void setPasos(List<Paso> pasos) {
        this.pasos = pasos;
    }

    public Lugar getLugar() {
        return lugar;
    }

    public void setLugar(Lugar lugar) {
        this.lugar = lugar;
    }
}
