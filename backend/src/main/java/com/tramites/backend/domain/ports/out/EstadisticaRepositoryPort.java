package com.tramites.backend.domain.ports.out;

import com.tramites.backend.domain.model.EstadisticaAccesibilidad;
import com.tramites.backend.domain.model.EstadisticaConsulta;
import com.tramites.backend.domain.model.EstadisticaUsuario;

import java.util.List;

public interface EstadisticaRepositoryPort {

    List<EstadisticaConsulta> findConsultasByMunicipalidadId(Long municipalidadId);

    List<EstadisticaUsuario> findUsuariosByMunicipalidadId(Long municipalidadId);

    List<EstadisticaAccesibilidad> findAccesibilidadByMunicipalidadId(Long municipalidadId);
}
