package com.tramites.backend.infrastructure.adapters.out.db.jpa;

import com.tramites.backend.domain.model.Requisito;
import com.tramites.backend.domain.model.Tramite;
import com.tramites.backend.domain.model.Formato;
import com.tramites.backend.domain.model.Paso;
import com.tramites.backend.domain.model.Lugar;
import com.tramites.backend.domain.ports.out.TramiteRepositoryPort;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
@Transactional(readOnly = true)
public class TramitePostgresAdapter implements TramiteRepositoryPort {
    private final TramiteJpaRepository tramiteJpaRepository;

    public TramitePostgresAdapter(TramiteJpaRepository tramiteJpaRepository) {
        this.tramiteJpaRepository = tramiteJpaRepository;
    }

    @Override
    @Cacheable(value = "tramites", unless = "#result.isEmpty()")
    public List<Tramite> findAll() {
        return tramiteJpaRepository.findAll().stream()
                .map(this::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    @Cacheable(value = "tramites", key = "#municipalidadId", unless = "#result.isEmpty()")
    public List<Tramite> findByMunicipalidadId(Long municipalidadId) {
        return tramiteJpaRepository.findByMunicipalidadId(municipalidadId).stream()
                .map(this::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<Tramite> findById(Long id) {
        return tramiteJpaRepository.findById(id).map(this::toDomain);
    }

    @Override
    @Transactional
    @CacheEvict(value = "tramites", allEntries = true)
    public Tramite save(Tramite domain) {
        TramiteJpaEntity entity;
        if (domain.getId() != null) {
            entity = tramiteJpaRepository.findById(domain.getId())
                    .orElse(new TramiteJpaEntity());
        } else {
            entity = new TramiteJpaEntity();
        }

        entity.setNombre(domain.getNombre());
        entity.setDescripcion(domain.getDescripcion());
        entity.setCosto(domain.getCosto());
        entity.setTiempoEstimado(domain.getTiempoEstimado());
        entity.setCategoria(domain.getCategoria());
        entity.setMunicipalidadId(domain.getMunicipalidadId());

        // Map Requisitos
        if (domain.getRequisitos() != null) {
            final TramiteJpaEntity parent = entity;
            List<RequisitoJpaEntity> reqEntities = domain.getRequisitos().stream()
                    .map(req -> new RequisitoJpaEntity(req.getId(), req.getDescripcion(), parent))
                    .collect(Collectors.toList());
            if (entity.getRequisitos() != null) {
                entity.getRequisitos().clear();
                entity.getRequisitos().addAll(reqEntities);
            } else {
                entity.setRequisitos(reqEntities);
            }
        } else {
            if (entity.getRequisitos() != null) {
                entity.getRequisitos().clear();
            }
        }

        // Map Formatos
        if (domain.getFormatos() != null) {
            final TramiteJpaEntity parent = entity;
            List<FormatoJpaEntity> fmtEntities = domain.getFormatos().stream()
                    .map(fmt -> new FormatoJpaEntity(fmt.getId(), fmt.getNombre(), fmt.getDescripcion(), fmt.getUrlDescarga(), parent))
                    .collect(Collectors.toList());
            if (entity.getFormatos() != null) {
                entity.getFormatos().clear();
                entity.getFormatos().addAll(fmtEntities);
            } else {
                entity.setFormatos(fmtEntities);
            }
        } else {
            if (entity.getFormatos() != null) {
                entity.getFormatos().clear();
            }
        }

        // Map Pasos
        if (domain.getPasos() != null) {
            final TramiteJpaEntity parent = entity;
            List<PasoJpaEntity> pasoEntities = domain.getPasos().stream()
                    .map(paso -> new PasoJpaEntity(paso.getId(), paso.getNumero(), paso.getTitulo(), paso.getDescripcion(), parent))
                    .collect(Collectors.toList());
            if (entity.getPasos() != null) {
                entity.getPasos().clear();
                entity.getPasos().addAll(pasoEntities);
            } else {
                entity.setPasos(pasoEntities);
            }
        } else {
            if (entity.getPasos() != null) {
                entity.getPasos().clear();
            }
        }

        // Map Lugar
        if (domain.getLugar() != null) {
            Lugar l = domain.getLugar();
            LugarJpaEntity lugarEntity = new LugarJpaEntity(l.getId(), l.getNombre(), l.getDireccion(), l.getHorario(), entity);
            entity.setLugar(lugarEntity);
        } else {
            entity.setLugar(null);
        }

        TramiteJpaEntity saved = tramiteJpaRepository.save(entity);
        return toDomain(saved);
    }

    @Override
    @Transactional
    @CacheEvict(value = "tramites", allEntries = true)
    public void deleteById(Long id) {
        tramiteJpaRepository.deleteById(id);
    }

    private Tramite toDomain(TramiteJpaEntity entity) {
        if (entity == null) {
            return null;
        }
        
        List<Requisito> requirements = new ArrayList<>();
        if (entity.getRequisitos() != null) {
            requirements = entity.getRequisitos().stream()
                    .map(reqEntity -> new Requisito(reqEntity.getId(), reqEntity.getDescripcion()))
                    .collect(Collectors.toList());
        }

        List<Formato> formatos = new ArrayList<>();
        if (entity.getFormatos() != null) {
            formatos = entity.getFormatos().stream()
                    .map(fmtEntity -> new Formato(fmtEntity.getId(), fmtEntity.getNombre(), fmtEntity.getDescripcion(), fmtEntity.getUrlDescarga()))
                    .collect(Collectors.toList());
        }

        List<Paso> pasos = new ArrayList<>();
        if (entity.getPasos() != null) {
            pasos = entity.getPasos().stream()
                    .map(pasoEntity -> new Paso(pasoEntity.getId(), pasoEntity.getNumero(), pasoEntity.getTitulo(), pasoEntity.getDescripcion()))
                    .collect(Collectors.toList());
        }

        Lugar lugar = null;
        if (entity.getLugar() != null) {
            lugar = new Lugar(entity.getLugar().getId(), entity.getLugar().getNombre(), entity.getLugar().getDireccion(), entity.getLugar().getHorario());
        }

        return new Tramite(
                entity.getId(),
                entity.getNombre(),
                entity.getDescripcion(),
                entity.getCosto() != null ? entity.getCosto() : BigDecimal.ZERO,
                entity.getTiempoEstimado(),
                entity.getCategoria(),
                entity.getMunicipalidadId(),
                requirements,
                formatos,
                pasos,
                lugar
        );
    }
}
