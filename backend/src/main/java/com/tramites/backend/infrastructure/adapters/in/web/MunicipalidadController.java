package com.tramites.backend.infrastructure.adapters.in.web;

import com.tramites.backend.domain.model.Municipalidad;
import com.tramites.backend.domain.ports.in.GetMunicipalidadesUseCase;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/municipalidades")
public class MunicipalidadController {
    private final GetMunicipalidadesUseCase getMunicipalidadesUseCase;

    public MunicipalidadController(GetMunicipalidadesUseCase getMunicipalidadesUseCase) {
        this.getMunicipalidadesUseCase = getMunicipalidadesUseCase;
    }

    @GetMapping
    public List<Municipalidad> getMunicipalidades() {
        return getMunicipalidadesUseCase.execute();
    }
}
