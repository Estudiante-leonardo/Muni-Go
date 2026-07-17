package com.tramites.backend.infrastructure.adapters.out.db.jpa;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "estadisticas_accesibilidad")
public class EstadisticaAccesibilidadJpaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "municipalidad_id", nullable = false)
    private Long municipalidadId;

    @Column(nullable = false)
    private String herramienta;

    @Column(nullable = false)
    private BigDecimal porcentaje;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getMunicipalidadId() { return municipalidadId; }
    public void setMunicipalidadId(Long municipalidadId) { this.municipalidadId = municipalidadId; }

    public String getHerramienta() { return herramienta; }
    public void setHerramienta(String herramienta) { this.herramienta = herramienta; }

    public BigDecimal getPorcentaje() { return porcentaje; }
    public void setPorcentaje(BigDecimal porcentaje) { this.porcentaje = porcentaje; }
}
