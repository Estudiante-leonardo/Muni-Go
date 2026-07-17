package com.tramites.backend.infrastructure.adapters.in.web;

import com.tramites.backend.domain.model.EstadisticaAccesibilidad;
import com.tramites.backend.domain.model.EstadisticaConsulta;
import com.tramites.backend.domain.model.EstadisticaUsuario;
import com.tramites.backend.domain.ports.in.GetEstadisticasUseCase;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/estadisticas")
public class EstadisticaController {

    private final GetEstadisticasUseCase getEstadisticasUseCase;

    public EstadisticaController(GetEstadisticasUseCase getEstadisticasUseCase) {
        this.getEstadisticasUseCase = getEstadisticasUseCase;
    }

    @GetMapping("/consultas")
    public List<EstadisticaConsulta> getConsultas(@RequestParam Long municipalidadId) {
        return getEstadisticasUseCase.getConsultasPorMes(municipalidadId);
    }

    @GetMapping("/usuarios")
    public List<EstadisticaUsuario> getUsuarios(@RequestParam Long municipalidadId) {
        return getEstadisticasUseCase.getUsuariosActivos(municipalidadId);
    }

    @GetMapping("/accesibilidad")
    public List<EstadisticaAccesibilidad> getAccesibilidad(@RequestParam Long municipalidadId) {
        return getEstadisticasUseCase.getAccesibilidad(municipalidadId);
    }
}
