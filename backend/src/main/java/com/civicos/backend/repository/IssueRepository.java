package com.civicos.backend.repository;

import com.civicos.backend.model.Issue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.UUID;

@Repository
public interface IssueRepository extends JpaRepository<Issue, UUID> {
    
    @Query("SELECT i FROM Issue i WHERE i.type = :type AND i.status != 'resolved' AND i.lat BETWEEN :minLat AND :maxLat AND i.lng BETWEEN :minLng AND :maxLng")
    List<Issue> findNearbyDuplicates(
            @Param("type") String type,
            @Param("minLat") Double minLat,
            @Param("maxLat") Double maxLat,
            @Param("minLng") Double minLng,
            @Param("maxLng") Double maxLng
    );
}
