package com.tramites.backend.infrastructure.adapters.out.db.jpa;

import jakarta.persistence.*;

@Entity
@Table(name = "lugares")
public class LugarJpaEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false)
    private String direccion;

    @Column(nullable = false)
    private String horario;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tramite_id", nullable = false, unique = true)
    private TramiteJpaEntity tramite;

    public LugarJpaEntity() {}

    public LugarJpaEntity(Long id, String nombre, String direccion, String horario, TramiteJpaEntity tramite) {
        this.id = id;
        this.nombre = nombre;
        this.direccion = direccion;
        this.horario = horario;
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

    public String getDireccion() {
        return direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }

    public String getHorario() {
        return horario;
    }

    public void setHorario(String horario) {
        this.horario = horario;
    }

    public TramiteJpaEntity getTramite() {
        return tramite;
    }

    public void setTramite(TramiteJpaEntity tramite) {
        this.tramite = tramite;
    }
}
