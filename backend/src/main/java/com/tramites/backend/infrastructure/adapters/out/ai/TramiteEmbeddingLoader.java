package com.tramites.backend.infrastructure.adapters.out.ai;

import com.tramites.backend.domain.model.Tramite;
import com.tramites.backend.domain.ports.out.TramiteRepositoryPort;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Component
public class TramiteEmbeddingLoader implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(TramiteEmbeddingLoader.class);

    private final TramiteRepositoryPort tramiteRepository;
    private final VectorStore vectorStore;

    public TramiteEmbeddingLoader(TramiteRepositoryPort tramiteRepository, VectorStore vectorStore) {
        this.tramiteRepository = tramiteRepository;
        this.vectorStore = vectorStore;
    }

    @Override
    public void run(ApplicationArguments args) {
        try {
            List<Document> existing = vectorStore.similaritySearch(
                    SearchRequest.builder().query("dummy").topK(1).build()
            );
            if (!existing.isEmpty()) {
                log.info("Vector store ya contiene datos. Saltando carga de embeddings.");
                return;
            }
        } catch (Exception e) {
            log.info("Vector store vacío o aún no disponible. Procediendo con carga inicial.");
        }

        List<Tramite> tramites = tramiteRepository.findAll();
        log.info("Cargando {} trámites en el vector store...", tramites.size());

        List<Document> documents = new ArrayList<>();
        for (Tramite t : tramites) {
            documents.addAll(chunkTramite(t));
        }

        vectorStore.add(documents);
        log.info("Carga completa: {} documentos insertados en el vector store.", documents.size());
    }

    private List<Document> chunkTramite(Tramite t) {
        List<Document> chunks = new ArrayList<>();

        StringBuilder fullText = new StringBuilder();
        fullText.append("Trámite: ").append(t.getNombre()).append("\n");
        fullText.append("Descripción: ").append(t.getDescripcion()).append("\n");
        fullText.append("Costo: S/ ").append(t.getCosto()).append("\n");
        fullText.append("Tiempo estimado: ").append(t.getTiempoEstimado()).append("\n");
        fullText.append("Categoría: ").append(t.getCategoria()).append("\n");

        if (t.getRequisitos() != null && !t.getRequisitos().isEmpty()) {
            fullText.append("Requisitos:\n");
            for (var req : t.getRequisitos()) {
                fullText.append("- ").append(req.getDescripcion()).append("\n");
            }
        }

        if (t.getPasos() != null && !t.getPasos().isEmpty()) {
            fullText.append("Pasos:\n");
            for (var paso : t.getPasos()) {
                fullText.append(paso.getNumero()).append(". ");
                fullText.append(paso.getTitulo());
                if (paso.getDescripcion() != null && !paso.getDescripcion().isBlank()) {
                    fullText.append(": ").append(paso.getDescripcion());
                }
                fullText.append("\n");
            }
        }

        if (t.getLugar() != null) {
            fullText.append("Lugar: ").append(t.getLugar().getNombre())
                    .append(", ").append(t.getLugar().getDireccion())
                    .append(" (").append(t.getLugar().getHorario()).append(")\n");
        }

        Map<String, Object> metadata = Map.of(
                "tramiteId", t.getId(),
                "nombre", t.getNombre() != null ? t.getNombre() : "",
                "categoria", t.getCategoria() != null ? t.getCategoria() : "",
                "municipalidadId", t.getMunicipalidadId() != null ? t.getMunicipalidadId() : 0L
        );

        chunks.add(new Document(fullText.toString(), metadata));

        return chunks;
    }
}
