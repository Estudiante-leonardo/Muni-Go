package com.tramites.backend.domain.ports.in;

import com.tramites.backend.domain.model.Tramite;
import java.util.List;

public interface GetTramitesUseCase {
    List<Tramite> execute(Long municipalidadId);
}
