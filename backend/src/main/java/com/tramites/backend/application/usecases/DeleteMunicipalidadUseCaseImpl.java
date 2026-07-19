package com.tramites.backend.application.usecases;

import com.tramites.backend.domain.ports.in.DeleteMunicipalidadUseCase;
import com.tramites.backend.domain.ports.out.MunicipalidadRepositoryPort;

public class DeleteMunicipalidadUseCaseImpl implements DeleteMunicipalidadUseCase {

    private final MunicipalidadRepositoryPort municipalidadRepositoryPort;

    public DeleteMunicipalidadUseCaseImpl(MunicipalidadRepositoryPort municipalidadRepositoryPort) {
        this.municipalidadRepositoryPort = municipalidadRepositoryPort;
    }

    @Override
    public void execute(Long id) {
        municipalidadRepositoryPort.delete(id);
    }
}
