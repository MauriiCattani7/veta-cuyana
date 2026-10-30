package com.portal.empleos.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.portal.empleos.model.OfertaTrabajo;

@Repository
public interface OfertaTrabajoRepository extends JpaRepository<OfertaTrabajo, Long> {
    // Permite listar todas las ofertas publicadas por una empresa específica
    List<OfertaTrabajo> findByEmpresaId(Long empresaId);
}