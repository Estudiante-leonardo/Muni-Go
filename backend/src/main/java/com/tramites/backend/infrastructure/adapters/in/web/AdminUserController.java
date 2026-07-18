package com.tramites.backend.infrastructure.adapters.in.web;

import com.tramites.backend.domain.model.AdminUser;
import com.tramites.backend.domain.ports.out.AdminUserRepositoryPort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/users")
public class AdminUserController {

    private final AdminUserRepositoryPort adminUserRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminUserController(AdminUserRepositoryPort adminUserRepository,
                               PasswordEncoder passwordEncoder) {
        this.adminUserRepository = adminUserRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping
    public List<Map<String, Object>> getAllAdmins() {
        return adminUserRepository.findAll().stream()
                .map(a -> Map.<String, Object>of(
                        "id", a.getId(),
                        "username", a.getUsername(),
                        "nombreCompleto", a.getNombreCompleto(),
                        "rol", a.getRol(),
                        "municipalidadId", a.getMunicipalidadId() != null ? a.getMunicipalidadId() : 0L,
                        "activo", a.getActivo()
                ))
                .collect(Collectors.toList());
    }

    @PostMapping
    public ResponseEntity<?> createAdmin(@RequestBody Map<String, Object> request) {
        String username = (String) request.get("username");
        String password = (String) request.get("password");
        String nombreCompleto = (String) request.get("nombreCompleto");
        String rol = (String) request.get("rol");
        Long municipalidadId = request.get("municipalidadId") != null
                ? ((Number) request.get("municipalidadId")).longValue()
                : null;

        if (adminUserRepository.existsByUsername(username)) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "El usuario '" + username + "' ya existe"));
        }

        AdminUser newAdmin = new AdminUser();
        newAdmin.setUsername(username);
        newAdmin.setPasswordHash(passwordEncoder.encode(password));
        newAdmin.setNombreCompleto(nombreCompleto);
        newAdmin.setRol(rol);
        newAdmin.setMunicipalidadId(municipalidadId);
        newAdmin.setActivo(true);

        AdminUser saved = adminUserRepository.save(newAdmin);
        return ResponseEntity.ok(Map.of(
                "id", saved.getId(),
                "username", saved.getUsername(),
                "message", "Admin creado exitosamente"
        ));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAdmin(@PathVariable Long id) {
        adminUserRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Admin eliminado"));
    }
}
