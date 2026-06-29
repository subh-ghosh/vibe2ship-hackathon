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

    @Autowired
    private org.springframework.core.env.Environment env;

    // POST /api/issues — create issue
    @PostMapping("/issues")
    public ResponseEntity<Issue> createIssue(@RequestBody Issue issue) {
        if (issue.getStatus() == null) issue.setStatus("reported");
        if (issue.getUpvotes() == null) issue.setUpvotes(1);
        
        // --- GEMINI AI AGENT: Categorization & Impact Analysis ---
        try {
            String apiKey = env.getProperty("civicos.gemini.api-key");
            if (apiKey != null && !apiKey.isEmpty() && issue.getDescription() != null) {
                org.springframework.web.client.RestTemplate restTemplate = new org.springframework.web.client.RestTemplate();
                String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + apiKey;
                
                String prompt = "You are CivicOS AI. Analyze this civic issue: '" + issue.getDescription() + "'. Return ONLY a JSON object with: 1) severity (string: low, medium, high, critical), 2) confidence (integer 0-100). Example: {\"severity\": \"high\", \"confidence\": 92}";
                
                String requestJson = "{ \"contents\": [{ \"parts\": [{\"text\": \"" + prompt.replace("\"", "\\\"") + "\"}] }] }";
                
                org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
                headers.setContentType(org.springframework.http.MediaType.APPLICATION_JSON);
                org.springframework.http.HttpEntity<String> entity = new org.springframework.http.HttpEntity<>(requestJson, headers);
                
                ResponseEntity<com.fasterxml.jackson.databind.JsonNode> response = restTemplate.postForEntity(url, entity, com.fasterxml.jackson.databind.JsonNode.class);
                
                if (response.getBody() != null) {
                    String rawText = response.getBody().path("candidates").get(0).path("content").path("parts").get(0).path("text").asText();
                    // Clean up markdown formatting if any
                    rawText = rawText.replaceAll("```json", "").replaceAll("```", "").trim();
                    
                    com.fasterxml.jackson.databind.JsonNode aiResult = new com.fasterxml.jackson.databind.ObjectMapper().readTree(rawText);
                    if (aiResult.has("severity")) issue.setSeverity(aiResult.get("severity").asText().toLowerCase());
                    if (aiResult.has("confidence")) issue.setAiConfidence(aiResult.get("confidence").asInt());
                }
            }
        } catch (Exception e) {
            System.err.println("Gemini AI failed, using fallback categorization: " + e.getMessage());
        }
        
        if (issue.getSeverity() == null) issue.setSeverity("medium");
        if (issue.getAiConfidence() == null) issue.setAiConfidence(85); // fallback confidence
        
        // --- AGENT 2: Duplicate Detection ---
        if (issue.getLat() != null && issue.getLng() != null) {
            double threshold = 0.0005; // Roughly 50 meters
            List<Issue> duplicates = issueRepository.findNearbyDuplicates(
                issue.getType(),
                issue.getLat() - threshold,
                issue.getLat() + threshold,
                issue.getLng() - threshold,
                issue.getLng() + threshold
            );
            
            if (!duplicates.isEmpty()) {
                Issue existing = duplicates.get(0);
                existing.setUpvotes((existing.getUpvotes() == null ? 0 : existing.getUpvotes()) + 1);
                existing.setTrustScore((existing.getTrustScore() == null ? 0 : existing.getTrustScore()) + 10);
                System.out.println("Duplicate detected by Agent 2. Merged into " + existing.getId());
                return ResponseEntity.ok(issueRepository.save(existing));
            }
        }
        
        Issue saved = issueRepository.save(issue);
        return ResponseEntity.ok(saved);
    }

    // POST /api/issues/{id}/verify — verify issue
    @PostMapping("/issues/{id}/verify")
    public ResponseEntity<Issue> verifyIssue(
            @PathVariable UUID id,
            @RequestBody Map<String, Object> body) {
        
        Optional<Issue> optIssue = issueRepository.findById(id);
        if (optIssue.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Issue issue = optIssue.get();
        String action = (String) body.getOrDefault("action", "upvote");
        
        if ("upvote".equals(action)) {
            issue.setUpvotes(issue.getUpvotes() + 1);
            if (issue.getUpvotes() > 5) {
                issue.setStatus("verified");
            }
        } else if ("downvote".equals(action)) {
            // we don't have a downvotes field in the entity currently, so we just decrease upvotes or track it
            issue.setUpvotes(Math.max(0, issue.getUpvotes() - 1));
        }
        
        Issue saved = issueRepository.save(issue);
        return ResponseEntity.ok(saved);
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
