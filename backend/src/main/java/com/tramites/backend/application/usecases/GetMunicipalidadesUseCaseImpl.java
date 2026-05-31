package com.tramites.backend.application.usecases;

import com.tramites.backend.domain.model.Municipalidad;
import com.tramites.backend.domain.ports.in.GetMunicipalidadesUseCase;
import com.tramites.backend.domain.ports.out.MunicipalidadRepositoryPort;
import java.util.List;

public class GetMunicipalidadesUseCaseImpl implements GetMunicipalidadesUseCase {
    private final MunicipalidadRepositoryPort municipalidadRepositoryPort;

    public GetMunicipalidadesUseCaseImpl(MunicipalidadRepositoryPort municipalidadRepositoryPort) {
        this.municipalidadRepositoryPort = municipalidadRepositoryPort;
    }

    @Override
    public List<Municipalidad> execute() {
        return municipalidadRepositoryPort.findAll();
    }
}
