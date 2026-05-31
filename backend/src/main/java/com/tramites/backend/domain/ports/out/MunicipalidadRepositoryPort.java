package com.tramites.backend.domain.ports.out;

import com.tramites.backend.domain.model.Municipalidad;
import java.util.List;

public interface MunicipalidadRepositoryPort {
    List<Municipalidad> findAll();
}
