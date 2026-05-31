package com.tramites.backend.infrastructure.adapters.out.db.jpa;

import jakarta.persistence.*;

@Entity
@Table(name = "pasos")
public class PasoJpaEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Integer numero;

    @Column(nullable = false)
    private String titulo;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String descripcion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tramite_id", nullable = false)
    private TramiteJpaEntity tramite;

    public PasoJpaEntity() {}

    public PasoJpaEntity(Long id, Integer numero, String titulo, String descripcion, TramiteJpaEntity tramite) {
        this.id = id;
        this.numero = numero;
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.tramite = tramite;
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

    public TramiteJpaEntity getTramite() {
        return tramite;
    }

    public void setTramite(TramiteJpaEntity tramite) {
        this.tramite = tramite;
    }
}
