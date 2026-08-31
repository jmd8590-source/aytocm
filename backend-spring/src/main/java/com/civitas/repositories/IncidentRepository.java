package com.civitas.repositories;

import com.civitas.models.Incident;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IncidentRepository extends JpaRepository<Incident, String> {

    List<Incident> findByMunicipalityIdOrderByCreatedAtDesc(String municipalityId);

    Optional<Incident> findByTrackingCode(String trackingCode);

    List<Incident> findByMunicipalityIdAndStatusIn(String municipalityId, List<String> statuses);

    /**
     * PostGIS Spatial Query: Finds active incidents within :radiusMeters of given coordinates
     */
    @Query(value = """
        SELECT * FROM incidents i
        WHERE i.municipality_id = :municipalityId
          AND i.status NOT IN ('resuelta', 'cerrada')
          AND ST_DWithin(
                i.location::geography,
                ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)::geography,
                :radiusMeters
              )
        ORDER BY ST_Distance(i.location::geography, ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)::geography) ASC
    """, nativeQuery = true)
    List<Incident> findNearbyDuplicates(
        @Param("municipalityId") String municipalityId,
        @Param("lat") double lat,
        @Param("lng") double lng,
        @Param("radiusMeters") double radiusMeters
    );
}
