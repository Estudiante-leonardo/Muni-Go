package com.tramites.backend.domain.model;

import java.math.BigDecimal;

public class EstadisticaAccesibilidad {

    private Long id;
    private Long municipalidadId;
    private String herramienta;
    private BigDecimal porcentaje;

    public EstadisticaAccesibilidad() {}

    public EstadisticaAccesibilidad(Long id, Long municipalidadId, String herramienta, BigDecimal porcentaje) {
        this.id = id;
        this.municipalidadId = municipalidadId;
        this.herramienta = herramienta;
        this.porcentaje = porcentaje;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getMunicipalidadId() { return municipalidadId; }
    public void setMunicipalidadId(Long municipalidadId) { this.municipalidadId = municipalidadId; }

    public String getHerramienta() { return herramienta; }
    public void setHerramienta(String herramienta) { this.herramienta = herramienta; }

    public BigDecimal getPorcentaje() { return porcentaje; }
    public void setPorcentaje(BigDecimal porcentaje) { this.porcentaje = porcentaje; }
}
