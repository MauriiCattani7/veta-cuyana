package com.portal.empleos.controller;

import com.portal.empleos.model.OfertaTrabajo;
import com.portal.empleos.service.OfertaTrabajoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/ofertas")
public class OfertaTrabajoController {

    private final OfertaTrabajoService service;

    public OfertaTrabajoController(OfertaTrabajoService service) {
        this.service = service;
    }

    // GET /api/ofertas -> Carga todas las ofertas para el index
    @GetMapping
    public ResponseEntity<List<OfertaTrabajo>> listarTodas() {
        return ResponseEntity.ok(service.listarTodas());
    }

    // GET /api/ofertas/{id} -> Detalle de una oferta
    @GetMapping("/{id}")
    public ResponseEntity<OfertaTrabajo> obtenerPorId(@PathVariable Long id) {
        return service.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // GET /api/ofertas/empresa/{empresaId} -> Ofertas creadas por una empresa
    @GetMapping("/empresa/{empresaId}")
    public ResponseEntity<List<OfertaTrabajo>> obtenerPorEmpresa(@PathVariable Long empresaId) {
        return ResponseEntity.ok(service.obtenerPorEmpresa(empresaId));
    }

    // POST /api/ofertas -> Publicar nueva vacante
    @PostMapping
    public ResponseEntity<OfertaTrabajo> crear(@RequestBody OfertaTrabajo oferta) {
        return ResponseEntity.ok(service.publicarOferta(oferta));
    }

    // DELETE /api/ofertas/{id} -> Dar de baja una oferta
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        service.eliminarOferta(id);
        return ResponseEntity.noContent().build();
    }
}