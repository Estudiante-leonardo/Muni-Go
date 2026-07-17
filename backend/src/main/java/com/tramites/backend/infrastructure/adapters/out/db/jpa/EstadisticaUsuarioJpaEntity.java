package com.tramites.backend.infrastructure.adapters.out.db.jpa;

import jakarta.persistence.*;

@Entity
@Table(name = "estadisticas_usuarios")
public class EstadisticaUsuarioJpaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "municipalidad_id", nullable = false)
    private Long municipalidadId;

    @Column(nullable = false)
    private String mes;

    @Column(nullable = false)
    private Integer anio;

    @Column(name = "usuarios_activos_promedio", nullable = false)
    private Integer usuariosActivosPromedio;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getMunicipalidadId() { return municipalidadId; }
    public void setMunicipalidadId(Long municipalidadId) { this.municipalidadId = municipalidadId; }

    public String getMes() { return mes; }
    public void setMes(String mes) { this.mes = mes; }

    public Integer getAnio() { return anio; }
    public void setAnio(Integer anio) { this.anio = anio; }

    public Integer getUsuariosActivosPromedio() { return usuariosActivosPromedio; }
    public void setUsuariosActivosPromedio(Integer usuariosActivosPromedio) { this.usuariosActivosPromedio = usuariosActivosPromedio; }
}
