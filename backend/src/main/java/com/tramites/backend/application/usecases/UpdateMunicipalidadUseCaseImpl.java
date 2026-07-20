package com.tramites.backend.application.usecases;

import com.tramites.backend.domain.model.Municipalidad;
import com.tramites.backend.domain.ports.in.UpdateMunicipalidadUseCase;
import com.tramites.backend.domain.ports.out.MunicipalidadRepositoryPort;

public class UpdateMunicipalidadUseCaseImpl implements UpdateMunicipalidadUseCase {

    private final MunicipalidadRepositoryPort municipalidadRepositoryPort;

    public UpdateMunicipalidadUseCaseImpl(MunicipalidadRepositoryPort municipalidadRepositoryPort) {
        this.municipalidadRepositoryPort = municipalidadRepositoryPort;
    }

    @Override
    public Municipalidad execute(Long id, String nombre, Boolean activo) {
        Municipalidad municipalidad = new Municipalidad();
        municipalidad.setId(id);
        
        if (nombre != null && !nombre.trim().isEmpty()) {
            municipalidad.setNombre(nombre);
        } else if (activo == null) {
            // si ambos son nulos/vacíos
            throw new IllegalArgumentException("No hay datos para actualizar");
        }
        
        if (activo != null) {
            municipalidad.setActivo(activo);
        }
        
        return municipalidadRepositoryPort.update(id, municipalidad);
    }
}
