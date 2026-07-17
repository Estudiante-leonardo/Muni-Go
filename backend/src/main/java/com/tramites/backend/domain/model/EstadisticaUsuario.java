package com.tramites.backend.domain.model;

public class EstadisticaUsuario {

    private Long id;
    private Long municipalidadId;
    private String mes;
    private Integer anio;
    private Integer usuariosActivosPromedio;

    public EstadisticaUsuario() {}

    public EstadisticaUsuario(Long id, Long municipalidadId, String mes, Integer anio, Integer usuariosActivosPromedio) {
        this.id = id;
        this.municipalidadId = municipalidadId;
        this.mes = mes;
        this.anio = anio;
        this.usuariosActivosPromedio = usuariosActivosPromedio;
    }

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
