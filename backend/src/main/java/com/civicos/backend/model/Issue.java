package com.civicos.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.GenericGenerator;
import java.util.Date;
import java.util.UUID;

@Data
@Entity
@Table(name = "issues")
public class Issue {

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    private UUID id;

    @Column(name = "external_id")
    private String externalId;

    private String type;
    private String title;
    private String description;
    
    private Double lat;
    private Double lng;
    
    private String severity;
    private String status;
    
    @Column(name = "reported_by")
    private UUID reportedBy;
    
    @Column(name = "reporter_name")
    private String reporterName;
    
    private String ward;
    
    @Column(name = "affected_population")
    private Integer affectedPopulation;
    
    @Column(name = "priority_score")
    private Integer priorityScore;
    
    @Column(name = "trust_score")
    private Integer trustScore;
    
    @Column(name = "economic_impact")
    private Long economicImpact;
    
    private Integer upvotes;
    
    @Column(name = "verification_count")
    private Integer verificationCount;
    
    @Column(name = "ai_category")
    private String aiCategory;
    
    @Column(name = "ai_confidence")
    private Integer aiConfidence;
    
    @Column(name = "created_at", insertable = false, updatable = false)
    private Date createdAt;
    
    @Column(name = "updated_at", insertable = false, updatable = false)
    private Date updatedAt;
}
