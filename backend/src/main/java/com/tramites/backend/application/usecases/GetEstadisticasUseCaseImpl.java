package com.tramites.backend.application.usecases;

import com.tramites.backend.domain.model.EstadisticaAccesibilidad;
import com.tramites.backend.domain.model.EstadisticaConsulta;
import com.tramites.backend.domain.model.EstadisticaUsuario;
import com.tramites.backend.domain.ports.in.GetEstadisticasUseCase;
import com.tramites.backend.domain.ports.out.EstadisticaRepositoryPort;

import java.util.List;

public class GetEstadisticasUseCaseImpl implements GetEstadisticasUseCase {

    private final EstadisticaRepositoryPort estadisticaRepositoryPort;

    public GetEstadisticasUseCaseImpl(EstadisticaRepositoryPort estadisticaRepositoryPort) {
        this.estadisticaRepositoryPort = estadisticaRepositoryPort;
    }

    @Override
    public List<EstadisticaConsulta> getConsultasPorMes(Long municipalidadId) {
        return estadisticaRepositoryPort.findConsultasByMunicipalidadId(municipalidadId);
    }

    @Override
    public List<EstadisticaUsuario> getUsuariosActivos(Long municipalidadId) {
        return estadisticaRepositoryPort.findUsuariosByMunicipalidadId(municipalidadId);
    }

    @Override
    public List<EstadisticaAccesibilidad> getAccesibilidad(Long municipalidadId) {
        return estadisticaRepositoryPort.findAccesibilidadByMunicipalidadId(municipalidadId);
    }
}
