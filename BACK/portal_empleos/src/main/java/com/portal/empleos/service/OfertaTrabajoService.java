package com.portal.empleos.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.portal.empleos.model.OfertaTrabajo;
import com.portal.empleos.repository.OfertaTrabajoRepository;

@Service
public class OfertaTrabajoService {

    private final OfertaTrabajoRepository repository;

    public OfertaTrabajoService(OfertaTrabajoRepository repository) {
        this.repository = repository;
    }

    public OfertaTrabajo publicarOferta(OfertaTrabajo oferta) {
        return repository.save(oferta);
    }

    public List<OfertaTrabajo> listarTodas() {
        return repository.findAll();
    }

    public Optional<OfertaTrabajo> obtenerPorId(Long id) {
        return repository.findById(id);
    }

    public List<OfertaTrabajo> obtenerPorEmpresa(Long empresaId) {
        return repository.findByEmpresaId(empresaId);
    }

    public void eliminarOferta(Long id) {
        repository.deleteById(id);
    }
}