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
    public Municipalidad execute(Long id, String nombre) {
        if (nombre == null || nombre.trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre de la municipalidad no puede estar vacío");
        }
        
        Municipalidad municipalidad = new Municipalidad(id, nombre);
        return municipalidadRepositoryPort.update(id, municipalidad);
    }
}
