package com.tramites.backend.infrastructure.adapters.in.web;

import com.tramites.backend.domain.model.AdminUser;
import com.tramites.backend.domain.ports.out.AdminUserRepositoryPort;
import com.tramites.backend.infrastructure.config.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/auth")
public class AuthController {

    private final AdminUserRepositoryPort adminUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthController(AdminUserRepositoryPort adminUserRepository,
                          PasswordEncoder passwordEncoder,
                          JwtUtil jwtUtil) {
        this.adminUserRepository = adminUserRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String password = request.get("password");

        if (username == null || password == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Usuario y contraseña son requeridos"));
        }

        var adminOpt = adminUserRepository.findByUsername(username);

        if (adminOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Credenciales incorrectas"));
        }

        AdminUser admin = adminOpt.get();

        if (!admin.getActivo()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Usuario desactivado"));
        }

        if (!passwordEncoder.matches(password, admin.getPasswordHash())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Credenciales incorrectas"));
        }

        String token = jwtUtil.generateToken(admin.getUsername(), admin.getRol(), admin.getMunicipalidadId());

        return ResponseEntity.ok(Map.of(
                "token", token,
                "rol", admin.getRol(),
                "nombreCompleto", admin.getNombreCompleto(),
                "username", admin.getUsername(),
                "municipalidadId", admin.getMunicipalidadId() != null ? admin.getMunicipalidadId().toString() : ""
        ));
    }
}
