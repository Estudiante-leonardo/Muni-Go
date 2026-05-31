package com.tramites.backend.infrastructure.config;

import com.tramites.backend.application.usecases.GetTramitesUseCaseImpl;
import com.tramites.backend.domain.ports.in.GetTramitesUseCase;
import com.tramites.backend.domain.ports.out.TramiteRepositoryPort;
import com.tramites.backend.application.usecases.GetMunicipalidadesUseCaseImpl;
import com.tramites.backend.domain.ports.in.GetMunicipalidadesUseCase;
import com.tramites.backend.domain.ports.out.MunicipalidadRepositoryPort;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class BeanConfiguration {

    @Bean
    public GetTramitesUseCase getTramitesUseCase(TramiteRepositoryPort tramiteRepositoryPort) {
        return new GetTramitesUseCaseImpl(tramiteRepositoryPort);
    }

    @Bean
    public GetMunicipalidadesUseCase getMunicipalidadesUseCase(MunicipalidadRepositoryPort municipalidadRepositoryPort) {
        return new GetMunicipalidadesUseCaseImpl(municipalidadRepositoryPort);
    }
}
