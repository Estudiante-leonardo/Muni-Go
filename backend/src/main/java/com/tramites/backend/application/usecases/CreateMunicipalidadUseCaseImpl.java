package com.tramites.backend.application.usecases;

import com.tramites.backend.domain.model.Municipalidad;
import com.tramites.backend.domain.ports.in.CreateMunicipalidadUseCase;
import com.tramites.backend.domain.ports.out.MunicipalidadRepositoryPort;

public class CreateMunicipalidadUseCaseImpl implements CreateMunicipalidadUseCase {

    private final MunicipalidadRepositoryPort municipalidadRepositoryPort;

    public CreateMunicipalidadUseCaseImpl(MunicipalidadRepositoryPort municipalidadRepositoryPort) {
        this.municipalidadRepositoryPort = municipalidadRepositoryPort;
    }

    @Override
    public Municipalidad execute(String nombre) {
        if (nombre == null || nombre.trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre de la municipalidad no puede estar vacío");
        }
        
        Municipalidad municipalidad = new Municipalidad();
        municipalidad.setNombre(nombre);
        municipalidad.setActivo(true);
        
        return municipalidadRepositoryPort.save(municipalidad);
    }
}
