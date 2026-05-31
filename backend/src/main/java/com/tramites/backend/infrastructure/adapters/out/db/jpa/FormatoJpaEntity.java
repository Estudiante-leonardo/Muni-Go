package com.tramites.backend.infrastructure.adapters.out.db.jpa;

import jakarta.persistence.*;

@Entity
@Table(name = "formatos")
public class FormatoJpaEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false)
    private String descripcion;

    @Column(name = "url_descarga", nullable = false)
    private String urlDescarga;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tramite_id", nullable = false)
    private TramiteJpaEntity tramite;

    public FormatoJpaEntity() {}

    public FormatoJpaEntity(Long id, String nombre, String descripcion, String urlDescarga, TramiteJpaEntity tramite) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.urlDescarga = urlDescarga;
        this.tramite = tramite;
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

    public TramiteJpaEntity getTramite() {
        return tramite;
    }

    public void setTramite(TramiteJpaEntity tramite) {
        this.tramite = tramite;
    }
}
