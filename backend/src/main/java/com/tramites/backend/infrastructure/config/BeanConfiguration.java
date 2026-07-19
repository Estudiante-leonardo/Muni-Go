package com.tramites.backend.infrastructure.config;

import com.tramites.backend.application.usecases.GetTramitesUseCaseImpl;
import com.tramites.backend.domain.ports.in.GetTramitesUseCase;
import com.tramites.backend.domain.ports.out.TramiteRepositoryPort;
import com.tramites.backend.application.usecases.GetMunicipalidadesUseCaseImpl;
import com.tramites.backend.domain.ports.in.GetMunicipalidadesUseCase;
import com.tramites.backend.domain.ports.out.MunicipalidadRepositoryPort;
import com.tramites.backend.application.usecases.GetEstadisticasUseCaseImpl;
import com.tramites.backend.domain.ports.in.GetEstadisticasUseCase;
import com.tramites.backend.domain.ports.out.EstadisticaRepositoryPort;
import com.tramites.backend.application.usecases.RagChatUseCaseImpl;
import com.tramites.backend.domain.ports.in.RagChatUseCase;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.vectorstore.VectorStore;
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

    @Bean
    public GetEstadisticasUseCase getEstadisticasUseCase(EstadisticaRepositoryPort estadisticaRepositoryPort) {
        return new GetEstadisticasUseCaseImpl(estadisticaRepositoryPort);
    }

    @Bean
    public RagChatUseCase ragChatUseCase(ChatModel chatModel, VectorStore vectorStore, TramiteRepositoryPort tramiteRepositoryPort) {
        return new RagChatUseCaseImpl(chatModel, vectorStore, tramiteRepositoryPort);
    }
}
