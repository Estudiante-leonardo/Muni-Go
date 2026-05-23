package com.tramites.backend.infrastructure.adapters.in.web;

import com.tramites.backend.domain.ports.in.GetTramitesUseCase;
import com.tramites.backend.infrastructure.adapters.in.web.dto.RequisitoDTO;
import com.tramites.backend.infrastructure.adapters.in.web.dto.TramiteDTO;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tramites")
@CrossOrigin(origins = "*")
public class TramiteController {
    private final GetTramitesUseCase getTramitesUseCase;

    public TramiteController(GetTramitesUseCase getTramitesUseCase) {
        this.getTramitesUseCase = getTramitesUseCase;
    }

    @GetMapping
    public List<TramiteDTO> getTramites() {
        return getTramitesUseCase.execute().stream()
                .map(tramite -> new TramiteDTO(
                        tramite.getId(),
                        tramite.getNombre(),
                        tramite.getDescripcion(),
                        tramite.getCosto(),
                        tramite.getTiempoEstimado(),
                        tramite.getCategoria(),
                        tramite.getRequisitos().stream()
                                .map(req -> new RequisitoDTO(req.getId(), req.getDescripcion()))
                                .collect(Collectors.toList())
                ))
                .collect(Collectors.toList());
    }
}
