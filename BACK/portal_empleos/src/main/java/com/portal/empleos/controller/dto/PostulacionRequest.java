package com.portal.empleos.controller.dto;

public class PostulacionRequest {
    private Long usuarioId;
    private Long ofertaId;
    private String nombreCompleto;
    private String whatsapp;
    private String experiencia;
    private String examenAltura;
    private String cvNombre;

    // Getters y Setters
    public Long getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }

    public Long getOfertaId() { return ofertaId; }
    public void setOfertaId(Long ofertaId) { this.ofertaId = ofertaId; }

    public String getNombreCompleto() { return nombreCompleto; }
    public void setNombreCompleto(String nombreCompleto) { this.nombreCompleto = nombreCompleto; }

    public String getWhatsapp() { return whatsapp; }
    public void setWhatsapp(String whatsapp) { this.whatsapp = whatsapp; }

    public String getExperiencia() { return experiencia; }
    public void setExperiencia(String experiencia) { this.experiencia = experiencia; }

    public String getExamenAltura() { return examenAltura; }
    public void setExamenAltura(String examenAltura) { this.examenAltura = examenAltura; }

    public String getCvNombre() { return cvNombre; }
    public void setCvNombre(String cvNombre) { this.cvNombre = cvNombre; }
}