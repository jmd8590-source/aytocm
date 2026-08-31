package com.civitas.models;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name = "suggestions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Suggestion {

    @Id
    private String id;

    @Column(name = "municipality_id", nullable = false)
    private String municipalityId;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    private String category;

    @Column(name = "author_id")
    private String authorId;

    @Column(name = "votes_count")
    @Builder.Default
    private Integer votesCount = 1;

    @Column(nullable = false)
    @Builder.Default
    private String status = "recibida"; // recibida, en_estudio, aprobada, en_ejecucion

    @Column(name = "budget_estimate")
    private String budgetEstimate;

    @Column(name = "official_response", columnDefinition = "TEXT")
    private String officialResponse;

    @Column(name = "converted_to_project")
    @Builder.Default
    private Boolean convertedToProject = false;

    @Column(name = "created_at")
    @Builder.Default
    private Instant createdAt = Instant.now();
}
