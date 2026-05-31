package com.tramites.backend.domain.ports.in;

import com.tramites.backend.domain.model.Municipalidad;
import java.util.List;

public interface GetMunicipalidadesUseCase {
    List<Municipalidad> execute();
}
