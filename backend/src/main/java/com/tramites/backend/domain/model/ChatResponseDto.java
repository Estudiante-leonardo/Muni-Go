package com.tramites.backend.domain.model;

public class ChatResponseDto {
    private String respuesta;
    private Long tramiteSugeridoId;
    private String tramiteSugeridoNombre;

    public ChatResponseDto(String respuesta, Long tramiteSugeridoId, String tramiteSugeridoNombre) {
        this.respuesta = respuesta;
        this.tramiteSugeridoId = tramiteSugeridoId;
        this.tramiteSugeridoNombre = tramiteSugeridoNombre;
    }

    public String getRespuesta() {
        return respuesta;
    }

    public void setRespuesta(String respuesta) {
        this.respuesta = respuesta;
    }

    public Long getTramiteSugeridoId() {
        return tramiteSugeridoId;
    }

    public void setTramiteSugeridoId(Long tramiteSugeridoId) {
        this.tramiteSugeridoId = tramiteSugeridoId;
    }

    public String getTramiteSugeridoNombre() {
        return tramiteSugeridoNombre;
    }

    public void setTramiteSugeridoNombre(String tramiteSugeridoNombre) {
        this.tramiteSugeridoNombre = tramiteSugeridoNombre;
    }
}
