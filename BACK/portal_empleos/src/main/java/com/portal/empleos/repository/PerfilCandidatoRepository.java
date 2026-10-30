package com.portal.empleos.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.portal.empleos.model.PerfilCandidato;

@Repository
public interface PerfilCandidatoRepository extends JpaRepository<PerfilCandidato, Long> {
    Optional<PerfilCandidato> findByUsuarioId(Long usuarioId);
}