package com.portal.empleos.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.portal.empleos.model.Postulacion;

@Repository
public interface PostulacionRepository extends JpaRepository<Postulacion, Long> {
    List<Postulacion> findByCandidatoId(Long candidatoId);
    List<Postulacion> findByOfertaId(Long ofertaId);
    Optional<Postulacion> findByOfertaIdAndCandidatoId(Long ofertaId, Long candidatoId);
}