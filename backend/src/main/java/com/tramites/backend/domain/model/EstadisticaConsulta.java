package com.tramites.backend.domain.model;

public class EstadisticaConsulta {

    private Long id;
    private Long municipalidadId;
    private String mes;
    private Integer anio;
    private String tipo;
    private Integer cantidad;

    public EstadisticaConsulta() {}

    public EstadisticaConsulta(Long id, Long municipalidadId, String mes, Integer anio, String tipo, Integer cantidad) {
        this.id = id;
        this.municipalidadId = municipalidadId;
        this.mes = mes;
        this.anio = anio;
        this.tipo = tipo;
        this.cantidad = cantidad;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getMunicipalidadId() { return municipalidadId; }
    public void setMunicipalidadId(Long municipalidadId) { this.municipalidadId = municipalidadId; }

    public String getMes() { return mes; }
    public void setMes(String mes) { this.mes = mes; }

    public Integer getAnio() { return anio; }
    public void setAnio(Integer anio) { this.anio = anio; }

    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }

    public Integer getCantidad() { return cantidad; }
    public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }
}
