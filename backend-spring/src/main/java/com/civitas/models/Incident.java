package com.civitas.models;

import jakarta.persistence.*;
import lombok.*;
import org.locationtech.jts.geom.Point;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "incidents")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Incident {

    @Id
    private String id;

    @Column(name = "tracking_code", unique = true, nullable = false)
    private String trackingCode;

    @Column(name = "municipality_id", nullable = false)
    private String municipalityId;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private String urgency; // baja, media, alta, urgente

    @Column(name = "priority_score")
    private Integer priorityScore;

    @Column(nullable = false)
    private String status; // recibida, validando, asignada, en_proceso, resuelta, cerrada

    @Column(name = "assigned_department_id")
    private String assignedDepartmentId;

    @Column(name = "assigned_employee_id")
    private String assignedEmployeeId;

    @Column(name = "citizen_id")
    private String citizenId;

    private String address;

    @Column(columnDefinition = "geometry(Point,4326)", nullable = false)
    private Point location;

    @Column(name = "adherents_count")
    @Builder.Default
    private Integer adherentsCount = 1;

    @Column(name = "resolution_notes", columnDefinition = "TEXT")
    private String resolutionNotes;

    @Column(name = "created_at")
    @Builder.Default
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at")
    @Builder.Default
    private Instant updatedAt = Instant.now();
}
