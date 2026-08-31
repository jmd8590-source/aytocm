package com.civitas.controllers;

import com.civitas.models.Incident;
import com.civitas.repositories.IncidentRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/incidents")
@RequiredArgsConstructor
@Tag(name = "Incidencias Urbanas", description = "Endpoints para registro, geoconsulta, deduplicación y resolución")
@CrossOrigin(origins = "*")
public class IncidentController {

    private final IncidentRepository incidentRepository;

    @GetMapping
    @Operation(summary = "Obtener todas las incidencias de un municipio")
    public ResponseEntity<List<Incident>> getIncidentsByMunicipality(@RequestParam String municipalityId) {
        return ResponseEntity.ok(incidentRepository.findByMunicipalityIdOrderByCreatedAtDesc(municipalityId));
    }

    @GetMapping("/duplicates/check")
    @Operation(summary = "Detectar posibles duplicados por proximidad GPS (<50m)")
    public ResponseEntity<List<Incident>> checkDuplicates(
            @RequestParam String municipalityId,
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam(defaultValue = "50.0") double radiusMeters) {
        return ResponseEntity.ok(incidentRepository.findNearbyDuplicates(municipalityId, lat, lng, radiusMeters));
    }

    @GetMapping("/{trackingCode}")
    @Operation(summary = "Consultar el estado y trazabilidad de una incidencia por código único")
    public ResponseEntity<Incident> getByTrackingCode(@PathVariable String trackingCode) {
        return incidentRepository.findByTrackingCode(trackingCode)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @Operation(summary = "Registrar nueva incidencia ciudadana")
    public ResponseEntity<Incident> createIncident(@RequestBody Incident incident) {
        // Validation, spatial indexing and saving
        Incident saved = incidentRepository.save(incident);
        return ResponseEntity.ok(saved);
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('EMPLOYEE', 'MUNICIPAL_ADMIN', 'SUPERADMIN')")
    @Operation(summary = "Actualizar estado de incidencia (Operarios y Administradores)")
    public ResponseEntity<Incident> updateStatus(
            @PathVariable String id,
            @RequestParam String status,
            @RequestParam(required = false) String comment) {
        return incidentRepository.findById(id).map(inc -> {
            inc.setStatus(status);
            if (comment != null) {
                inc.setResolutionNotes(comment);
            }
            return ResponseEntity.ok(incidentRepository.save(inc));
        }).orElse(ResponseEntity.notFound().build());
    }
}
