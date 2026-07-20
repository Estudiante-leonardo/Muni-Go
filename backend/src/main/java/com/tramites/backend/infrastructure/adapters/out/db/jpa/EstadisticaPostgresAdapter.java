package com.tramites.backend.infrastructure.adapters.out.db.jpa;

import com.tramites.backend.domain.model.EstadisticaAccesibilidad;
import com.tramites.backend.domain.model.EstadisticaConsulta;
import com.tramites.backend.domain.model.EstadisticaUsuario;
import com.tramites.backend.domain.ports.out.EstadisticaRepositoryPort;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class EstadisticaPostgresAdapter implements EstadisticaRepositoryPort {

    private final EstadisticaConsultaJpaRepository consultaRepository;
    private final EstadisticaUsuarioJpaRepository usuarioRepository;
    private final EstadisticaAccesibilidadJpaRepository accesibilidadRepository;

    public EstadisticaPostgresAdapter(
            EstadisticaConsultaJpaRepository consultaRepository,
            EstadisticaUsuarioJpaRepository usuarioRepository,
            EstadisticaAccesibilidadJpaRepository accesibilidadRepository) {
        this.consultaRepository = consultaRepository;
        this.usuarioRepository = usuarioRepository;
        this.accesibilidadRepository = accesibilidadRepository;
    }

    @Override
    public List<EstadisticaConsulta> findConsultasByMunicipalidadId(Long municipalidadId) {
        List<EstadisticaConsultaJpaEntity> entities = municipalidadId == 0 
            ? consultaRepository.findAll()
            : consultaRepository.findByMunicipalidadIdOrderByAnioAscMesAsc(municipalidadId);
            
        return entities.stream()
                .map(entity -> new EstadisticaConsulta(
                        entity.getId(),
                        entity.getMunicipalidadId(),
                        entity.getMes(),
                        entity.getAnio(),
                        entity.getTipo(),
                        entity.getCantidad()
                ))
                .collect(Collectors.toList());
    }

    @Override
    public List<EstadisticaUsuario> findUsuariosByMunicipalidadId(Long municipalidadId) {
        List<EstadisticaUsuarioJpaEntity> entities = municipalidadId == 0
            ? usuarioRepository.findAll()
            : usuarioRepository.findByMunicipalidadIdOrderByAnioAscMesAsc(municipalidadId);

        return entities.stream()
                .map(entity -> new EstadisticaUsuario(
                        entity.getId(),
                        entity.getMunicipalidadId(),
                        entity.getMes(),
                        entity.getAnio(),
                        entity.getUsuariosActivosPromedio()
                ))
                .collect(Collectors.toList());
    }

    @Override
    public List<EstadisticaAccesibilidad> findAccesibilidadByMunicipalidadId(Long municipalidadId) {
        List<EstadisticaAccesibilidadJpaEntity> entities = municipalidadId == 0
            ? accesibilidadRepository.findAll()
            : accesibilidadRepository.findByMunicipalidadId(municipalidadId);

        return entities.stream()
                .map(entity -> new EstadisticaAccesibilidad(
                        entity.getId(),
                        entity.getMunicipalidadId(),
                        entity.getHerramienta(),
                        entity.getPorcentaje()
                ))
                .collect(Collectors.toList());
    }
}
