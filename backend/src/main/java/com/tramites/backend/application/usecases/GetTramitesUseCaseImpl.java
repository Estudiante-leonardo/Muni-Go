package com.tramites.backend.application.usecases;

import com.tramites.backend.domain.model.Tramite;
import com.tramites.backend.domain.ports.in.GetTramitesUseCase;
import com.tramites.backend.domain.ports.out.TramiteRepositoryPort;
import java.util.List;

public class GetTramitesUseCaseImpl implements GetTramitesUseCase {
    private final TramiteRepositoryPort tramiteRepositoryPort;

    public GetTramitesUseCaseImpl(TramiteRepositoryPort tramiteRepositoryPort) {
        this.tramiteRepositoryPort = tramiteRepositoryPort;
    }

    @Override
    public List<Tramite> execute(Long municipalidadId) {
        if (municipalidadId != null) {
            return tramiteRepositoryPort.findByMunicipalidadId(municipalidadId);
        }
        return tramiteRepositoryPort.findAll();
    }
}
