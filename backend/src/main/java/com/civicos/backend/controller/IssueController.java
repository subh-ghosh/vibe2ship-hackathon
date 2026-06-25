package com.civicos.backend.controller;

import com.civicos.backend.model.Issue;
import com.civicos.backend.repository.IssueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") // Added basic CORS for hackathon
public class IssueController {

    @Autowired
    private IssueRepository issueRepository;

    // GET /api/issues — list all issues
    @GetMapping("/issues")
    public ResponseEntity<Map<String, Object>> getIssues(
            @RequestParam(defaultValue = "all") String type,
            @RequestParam(defaultValue = "all") String severity,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "200") int size) {
        
        Page<Issue> issuesPage = issueRepository.findAll(PageRequest.of(page, size, Sort.by("createdAt").descending()));
        
        return ResponseEntity.ok(Map.of(
            "status", "ok",
            "content", issuesPage.getContent(),
            "totalPages", issuesPage.getTotalPages(),
            "totalElements", issuesPage.getTotalElements(),
            "page", page,
            "size", size
        ));
    }

    // POST /api/issues — create issue
    @PostMapping("/issues")
    public ResponseEntity<Issue> createIssue(@RequestBody Issue issue) {
        if (issue.getStatus() == null) issue.setStatus("reported");
        if (issue.getSeverity() == null) issue.setSeverity("medium");
        if (issue.getUpvotes() == null) issue.setUpvotes(1);
        
        Issue saved = issueRepository.save(issue);
        return ResponseEntity.ok(saved);
    }

    // POST /api/issues/{id}/verify — verify issue
    @PostMapping("/issues/{id}/verify")
    public ResponseEntity<Map<String, Object>> verifyIssue(
            @PathVariable String id,
            @RequestBody Map<String, Object> body) {
        return ResponseEntity.ok(Map.of(
            "issueId", id,
            "action", body.getOrDefault("action", "confirm"),
            "newTrustScore", 75,
            "message", "Verification recorded"
        ));
    }

    // GET /api/issues/{id}/status — get issue status
    @GetMapping("/issues/{id}/status")
    public ResponseEntity<Map<String, Object>> getIssueStatus(@PathVariable String id) {
        return ResponseEntity.ok(Map.of(
            "id", id,
            "status", "in_progress",
            "lastUpdated", new Date().toString()
        ));
    }

    // GET /api/dashboard — authority dashboard summary
    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboard() {
        return ResponseEntity.ok(Map.of(
            "cityHealthScore", 67,
            "activeIssues", 112,
            "criticalIssues", 14,
            "resolvedToday", 8,
            "totalAffectedPopulation", 245000
        ));
    }

    // GET /api/predictions — prediction heatmap
    @GetMapping("/predictions")
    public ResponseEntity<Map<String, Object>> getPredictions() {
        return ResponseEntity.ok(Map.of(
            "status", "ok",
            "predictions", List.of(),
            "message", "Prediction data served from AI agent"
        ));
    }

    // GET /api/wards — ward health scores
    @GetMapping("/wards")
    public ResponseEntity<Map<String, Object>> getWards() {
        return ResponseEntity.ok(Map.of(
            "status", "ok",
            "wards", List.of()
        ));
    }

    // GET /api/health
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "UP", "service", "CivicOS Backend"));
    }
}
