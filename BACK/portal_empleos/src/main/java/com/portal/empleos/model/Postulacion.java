package com.portal.empleos.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "postulaciones")
public class Postulacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "oferta_id", nullable = false)
    private Long ofertaId;

    @Column(name = "candidato_id", nullable = false)
    private Long candidatoId;

    @Column(length = 50)
    private String estado = "Pendiente";

    @Column(name = "fecha_postulacion", updatable = false)
    private LocalDateTime fechaPostulacion;

    @PrePersist
    protected void onCreate() {
        this.fechaPostulacion = LocalDateTime.now();
        if (this.estado == null) {
            this.estado = "Pendiente";
        }
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getOfertaId() { return ofertaId; }
    public void setOfertaId(Long ofertaId) { this.ofertaId = ofertaId; }

    public Long getCandidatoId() { return candidatoId; }
    public void setCandidatoId(Long candidatoId) { this.candidatoId = candidatoId; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public LocalDateTime getFechaPostulacion() { return fechaPostulacion; }
    public void setFechaPostulacion(LocalDateTime fechaPostulacion) { this.fechaPostulacion = fechaPostulacion; }
}