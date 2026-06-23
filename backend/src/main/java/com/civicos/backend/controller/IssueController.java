package com.civicos.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api")
public class IssueController {

    // GET /api/issues — list all issues
    @GetMapping("/issues")
    public ResponseEntity<Map<String, Object>> getIssues(
            @RequestParam(defaultValue = "all") String type,
            @RequestParam(defaultValue = "all") String severity,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        // Returns mock response — replace with JPA repository call
        return ResponseEntity.ok(Map.of(
            "status", "ok",
            "message", "Connect to PostgreSQL and use IssueRepository to serve real data",
            "page", page,
            "size", size
        ));
    }

    // POST /api/issues — create issue
    @PostMapping("/issues")
    public ResponseEntity<Map<String, Object>> createIssue(@RequestBody Map<String, Object> body) {
        String issueId = "ISS-" + System.currentTimeMillis();
        return ResponseEntity.ok(Map.of(
            "id", issueId,
            "status", "reported",
            "message", "Issue created successfully"
        ));
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
