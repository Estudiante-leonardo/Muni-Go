package com.tramites.backend.infrastructure.adapters.out.db.jpa;

import jakarta.persistence.*;

@Entity
@Table(name = "requisitos")
public class RequisitoJpaEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String descripcion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tramite_id", nullable = false)
    private TramiteJpaEntity tramite;

    public RequisitoJpaEntity() {
    }

    public RequisitoJpaEntity(Long id, String descripcion, TramiteJpaEntity tramite) {
        this.id = id;
        this.descripcion = descripcion;
        this.tramite = tramite;
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

    public TramiteJpaEntity getTramite() {
        return tramite;
    }

    public void setTramite(TramiteJpaEntity tramite) {
        this.tramite = tramite;
    }
}
