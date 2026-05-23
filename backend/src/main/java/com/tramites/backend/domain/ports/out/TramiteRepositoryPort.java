package com.tramites.backend.domain.ports.out;

import com.tramites.backend.domain.model.Tramite;
import java.util.List;

public interface TramiteRepositoryPort {
    List<Tramite> findAll();
}
