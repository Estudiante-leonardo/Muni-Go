package com.tramites.backend.infrastructure.adapters.out.db.jpa;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "tramites")
public class TramiteJpaEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal costo;

    @Column(name = "tiempo_estimado", nullable = false)
    private String tiempoEstimado;

    @Column(nullable = false)
    private String categoria;

    @OneToMany(mappedBy = "tramite", cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    private List<RequisitoJpaEntity> requisitos;

    @OneToMany(mappedBy = "tramite", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private List<FormatoJpaEntity> formatos;

    @OneToMany(mappedBy = "tramite", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private List<PasoJpaEntity> pasos;

    @OneToOne(mappedBy = "tramite", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private LugarJpaEntity lugar;

    public TramiteJpaEntity() {
    }

    public TramiteJpaEntity(Long id, String nombre, String descripcion, BigDecimal costo, String tiempoEstimado, String categoria, List<RequisitoJpaEntity> requisitos, List<FormatoJpaEntity> formatos, List<PasoJpaEntity> pasos, LugarJpaEntity lugar) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.costo = costo;
        this.tiempoEstimado = tiempoEstimado;
        this.categoria = categoria;
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

    public List<RequisitoJpaEntity> getRequisitos() {
        return requisitos;
    }

    public void setRequisitos(List<RequisitoJpaEntity> requisitos) {
        this.requisitos = requisitos;
    }

    public List<FormatoJpaEntity> getFormatos() {
        return formatos;
    }

    public void setFormatos(List<FormatoJpaEntity> formatos) {
        this.formatos = formatos;
    }

    public List<PasoJpaEntity> getPasos() {
        return pasos;
    }

    public void setPasos(List<PasoJpaEntity> pasos) {
        this.pasos = pasos;
    }

    public LugarJpaEntity getLugar() {
        return lugar;
    }

    public void setLugar(LugarJpaEntity lugar) {
        this.lugar = lugar;
    }
}
