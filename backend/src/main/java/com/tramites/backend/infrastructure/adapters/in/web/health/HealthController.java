package com.tramites.backend.infrastructure.adapters.in.web.health;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class HealthController {

    @GetMapping("/api/health")
    public ResponseEntity<Map<String, Object>> health() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "service", "Muni-Go Backend",
                "timestamp", System.currentTimeMillis()
        ));
    }

    @GetMapping("/")
    public ResponseEntity<String> root() {
        return ResponseEntity.ok("Muni-Go Backend is running.");
    }
}
