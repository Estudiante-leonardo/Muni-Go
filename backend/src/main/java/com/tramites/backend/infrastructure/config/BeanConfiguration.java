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
import org.springframework.ai.chat.memory.ChatMemory;
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
    public ChatMemory chatMemory() {
        return new LocalInMemoryChatMemory();
    }

    @Bean
    public RagChatUseCase ragChatUseCase(ChatModel chatModel, VectorStore vectorStore, TramiteRepositoryPort tramiteRepositoryPort, ChatMemory chatMemory) {
        return new RagChatUseCaseImpl(chatModel, vectorStore, tramiteRepositoryPort, chatMemory);
    }

    @Bean
    public com.tramites.backend.domain.ports.in.CreateMunicipalidadUseCase createMunicipalidadUseCase(MunicipalidadRepositoryPort municipalidadRepositoryPort) {
        return new com.tramites.backend.application.usecases.CreateMunicipalidadUseCaseImpl(municipalidadRepositoryPort);
    }

    @Bean
    public com.tramites.backend.domain.ports.in.UpdateMunicipalidadUseCase updateMunicipalidadUseCase(MunicipalidadRepositoryPort municipalidadRepositoryPort) {
        return new com.tramites.backend.application.usecases.UpdateMunicipalidadUseCaseImpl(municipalidadRepositoryPort);
    }

    @Bean
    public com.tramites.backend.domain.ports.in.DeleteMunicipalidadUseCase deleteMunicipalidadUseCase(MunicipalidadRepositoryPort municipalidadRepositoryPort) {
        return new com.tramites.backend.application.usecases.DeleteMunicipalidadUseCaseImpl(municipalidadRepositoryPort);
    }
}
