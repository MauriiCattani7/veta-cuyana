package com.portal.empleos.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.portal.empleos.controller.dto.PostulacionRequest;
import com.portal.empleos.model.PerfilCandidato;
import com.portal.empleos.model.Postulacion;
import com.portal.empleos.repository.PerfilCandidatoRepository;
import com.portal.empleos.repository.PostulacionRepository;

@Service
public class PostulacionService {

    private final PostulacionRepository postulacionRepository;
    private final PerfilCandidatoRepository perfilRepository;

    public PostulacionService(PostulacionRepository postulacionRepository, PerfilCandidatoRepository perfilRepository) {
        this.postulacionRepository = postulacionRepository;
        this.perfilRepository = perfilRepository;
    }

    @Transactional
    public Postulacion postular(PostulacionRequest req) {
        // 1. Obtener o crear el perfil del candidato
        PerfilCandidato perfil = perfilRepository.findByUsuarioId(req.getUsuarioId())
                .orElseGet(() -> {
                    PerfilCandidato nuevo = new PerfilCandidato();
                    nuevo.setUsuarioId(req.getUsuarioId());
                    String[] partes = (req.getNombreCompleto() != null ? req.getNombreCompleto().trim() : "Candidato").split(" ", 2);
                    nuevo.setNombre(partes[0]);
                    nuevo.setApellido(partes.length > 1 ? partes[1] : "-");
                    return nuevo;
                });

        // 2. Actualizar datos de contacto y CV
        if (req.getWhatsapp() != null) perfil.setSobreMi("WhatsApp: " + req.getWhatsapp());
        String habilidades = "Exp: " + req.getExperiencia() + " | Altura: " + req.getExamenAltura();
        perfil.setHabilidades(habilidades);
        if (req.getCvNombre() != null) {
            perfil.setCvUrl(req.getCvNombre());
        }
        perfil = perfilRepository.save(perfil);

        // 3. Verificar si ya se postuló previamente a esta vacante
        Optional<Postulacion> existente = postulacionRepository.findByOfertaIdAndCandidatoId(req.getOfertaId(), perfil.getId());
        if (existente.isPresent()) {
            return existente.get();
        }

        // 4. Guardar nueva postulación
        Postulacion p = new Postulacion();
        p.setOfertaId(req.getOfertaId());
        p.setCandidatoId(perfil.getId());
        return postulacionRepository.save(p);
    }

    public List<Postulacion> listarPorCandidato(Long usuarioId) {
        return perfilRepository.findByUsuarioId(usuarioId)
                .map(perfil -> postulacionRepository.findByCandidatoId(perfil.getId()))
                .orElse(List.of());
    }
}