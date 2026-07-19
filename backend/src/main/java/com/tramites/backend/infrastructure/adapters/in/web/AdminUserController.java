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

    @PutMapping("/{id}")
    public ResponseEntity<?> updateAdmin(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        var opt = adminUserRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        AdminUser existing = opt.get();

        if (request.containsKey("activo") && Boolean.FALSE.equals(request.get("activo"))
                && "superAdmin".equals(existing.getUsername())) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "El usuario superAdmin no puede ser deshabilitado"));
        }

        String nombreCompleto = (String) request.get("nombreCompleto");
        if (nombreCompleto != null) {
            existing.setNombreCompleto(nombreCompleto);
        }

        String rol = (String) request.get("rol");
        if (rol != null) {
            existing.setRol(rol);
        }

        if (request.containsKey("municipalidadId") && request.get("municipalidadId") != null) {
            existing.setMunicipalidadId(((Number) request.get("municipalidadId")).longValue());
        } else if (request.containsKey("municipalidadId")) {
            existing.setMunicipalidadId(null);
        }

        String password = (String) request.get("password");
        if (password != null && !password.isEmpty()) {
            existing.setPasswordHash(passwordEncoder.encode(password));
        }

        if (request.containsKey("activo")) {
            existing.setActivo((Boolean) request.get("activo"));
        }

        adminUserRepository.save(existing);

        return ResponseEntity.ok(Map.of(
                "id", existing.getId(),
                "username", existing.getUsername(),
                "message", "Admin actualizado exitosamente"
        ));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAdmin(@PathVariable Long id) {
        adminUserRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Admin eliminado"));
    }
}
