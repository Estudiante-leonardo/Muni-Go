package com.tramites.backend.infrastructure.adapters.in.web.dto;

public class LugarDTO {
    private Long id;
    private String nombre;
    private String direccion;
    private String horario;

    public LugarDTO() {}

    public LugarDTO(Long id, String nombre, String direccion, String horario) {
        this.id = id;
        this.nombre = nombre;
        this.direccion = direccion;
        this.horario = horario;
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
}
