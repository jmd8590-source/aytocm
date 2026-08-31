package com.civitas.models;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    private String id;

    @Column(name = "municipality_id")
    private String municipalityId;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    private String phone;

    @Column(nullable = false)
    private String role; // ROLE_CITIZEN, ROLE_EMPLOYEE, ROLE_MUNICIPAL_ADMIN, ROLE_SUPERADMIN

    @Column(name = "department_id")
    private String departmentId;

    @Column(name = "is_verified")
    @Builder.Default
    private Boolean isVerified = false;

    @Column(name = "avatar_url")
    private String avatarUrl;

    @Column(name = "created_at")
    @Builder.Default
    private Instant createdAt = Instant.now();
}
