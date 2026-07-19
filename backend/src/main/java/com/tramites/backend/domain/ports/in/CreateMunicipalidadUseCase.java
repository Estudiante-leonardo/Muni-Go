package com.tramites.backend.domain.ports.in;

import com.tramites.backend.domain.model.Municipalidad;

public interface CreateMunicipalidadUseCase {
    Municipalidad execute(String nombre);
}
