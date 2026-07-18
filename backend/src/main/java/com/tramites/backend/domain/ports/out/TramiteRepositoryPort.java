package com.tramites.backend.domain.ports.out;

import com.tramites.backend.domain.model.Tramite;
import java.util.List;
import java.util.Optional;

public interface TramiteRepositoryPort {
    List<Tramite> findAll();
    List<Tramite> findByMunicipalidadId(Long municipalidadId);
    Optional<Tramite> findById(Long id);
}
