package com.tramites.backend.domain.ports.in;

import com.tramites.backend.domain.model.EstadisticaAccesibilidad;
import com.tramites.backend.domain.model.EstadisticaConsulta;
import com.tramites.backend.domain.model.EstadisticaUsuario;

import java.util.List;

public interface GetEstadisticasUseCase {

    List<EstadisticaConsulta> getConsultasPorMes(Long municipalidadId);

    List<EstadisticaUsuario> getUsuariosActivos(Long municipalidadId);

    List<EstadisticaAccesibilidad> getAccesibilidad(Long municipalidadId);
}
