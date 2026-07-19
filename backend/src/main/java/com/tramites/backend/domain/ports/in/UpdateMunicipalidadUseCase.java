package com.tramites.backend.domain.ports.in;

import com.tramites.backend.domain.model.Municipalidad;

public interface UpdateMunicipalidadUseCase {
    Municipalidad execute(Long id, String nombre);
}
