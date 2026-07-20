package com.tramites.backend.infrastructure.adapters.out.db.jpa;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.tramites.backend.domain.model.Municipalidad;

@Entity
@Table(name = "municipalidades")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MunicipalidadJpaEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false)
    @Builder.Default
    private Boolean activo = true;

    public Municipalidad toDomain() {
        return Municipalidad.builder()
                .id(this.id)
                .nombre(this.nombre)
                .activo(this.activo)
                .build();
    }
}
