package com.portal.empleos.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.portal.empleos.controller.dto.PostulacionRequest;
import com.portal.empleos.model.Postulacion;
import com.portal.empleos.service.PostulacionService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/postulaciones")
public class PostulacionController {

    private final PostulacionService service;

    public PostulacionController(PostulacionService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Postulacion> crear(@RequestBody PostulacionRequest req) {
        return ResponseEntity.ok(service.postular(req));
    }

    @GetMapping("/candidato/{usuarioId}")
    public ResponseEntity<List<Postulacion>> listarPorUsuario(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(service.listarPorCandidato(usuarioId));
    }
}