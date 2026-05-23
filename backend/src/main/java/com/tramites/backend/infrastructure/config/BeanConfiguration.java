package com.tramites.backend.infrastructure.config;

import com.tramites.backend.application.usecases.GetTramitesUseCaseImpl;
import com.tramites.backend.domain.ports.in.GetTramitesUseCase;
import com.tramites.backend.domain.ports.out.TramiteRepositoryPort;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class BeanConfiguration {

    @Bean
    public GetTramitesUseCase getTramitesUseCase(TramiteRepositoryPort tramiteRepositoryPort) {
        return new GetTramitesUseCaseImpl(tramiteRepositoryPort);
    }
}
