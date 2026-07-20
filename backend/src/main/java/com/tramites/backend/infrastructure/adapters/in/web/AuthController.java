package com.tramites.backend.infrastructure.adapters.in.web;

import com.tramites.backend.domain.model.AdminUser;
import com.tramites.backend.domain.model.RefreshTokenModel;
import com.tramites.backend.domain.ports.out.AdminUserRepositoryPort;
import com.tramites.backend.domain.ports.out.RefreshTokenRepositoryPort;
import com.tramites.backend.infrastructure.config.JwtUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/auth")
public class AuthController {

    private final AdminUserRepositoryPort adminUserRepository;
    private final RefreshTokenRepositoryPort refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final long refreshExpirationMs;

    public AuthController(AdminUserRepositoryPort adminUserRepository,
                          RefreshTokenRepositoryPort refreshTokenRepository,
                          PasswordEncoder passwordEncoder,
                          JwtUtil jwtUtil,
                          @Value("${jwt.refresh-expiration-ms}") long refreshExpirationMs) {
        this.adminUserRepository = adminUserRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.refreshExpirationMs = refreshExpirationMs;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request,
                                   HttpServletResponse response) {
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

        String accessToken = jwtUtil.generateToken(admin.getUsername(), admin.getRol(), admin.getMunicipalidadId());
        setAccessTokenCookie(response, accessToken);

        String refreshTokenValue = jwtUtil.generateRefreshToken();
        saveRefreshToken(refreshTokenValue, admin.getUsername());
        setRefreshTokenCookie(response, refreshTokenValue);

        return ResponseEntity.ok(Map.of(
                "rol", admin.getRol(),
                "nombreCompleto", admin.getNombreCompleto(),
                "username", admin.getUsername(),
                "municipalidadId", admin.getMunicipalidadId() != null ? admin.getMunicipalidadId().toString() : ""
        ));
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(HttpServletRequest request,
                                     HttpServletResponse response) {
        String refreshTokenValue = extractCookieValue(request, "refresh_token");
        if (refreshTokenValue == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Refresh token no encontrado"));
        }

        var tokenOpt = refreshTokenRepository.findByToken(refreshTokenValue);
        if (tokenOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Refresh token inválido"));
        }

        RefreshTokenModel storedToken = tokenOpt.get();

        if (storedToken.isRevoked() || storedToken.isExpired()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Refresh token revocado o expirado"));
        }

        var adminOpt = adminUserRepository.findByUsername(storedToken.getUsername());
        if (adminOpt.isEmpty() || !adminOpt.get().getActivo()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Usuario no encontrado o desactivado"));
        }

        AdminUser admin = adminOpt.get();

        String newAccessToken = jwtUtil.generateToken(admin.getUsername(), admin.getRol(), admin.getMunicipalidadId());
        setAccessTokenCookie(response, newAccessToken);

        String newRefreshToken = jwtUtil.generateRefreshToken();
        saveRefreshToken(newRefreshToken, admin.getUsername());
        setRefreshTokenCookie(response, newRefreshToken);

        return ResponseEntity.ok(Map.of(
                "rol", admin.getRol(),
                "nombreCompleto", admin.getNombreCompleto(),
                "username", admin.getUsername(),
                "municipalidadId", admin.getMunicipalidadId() != null ? admin.getMunicipalidadId().toString() : ""
        ));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request,
                                    HttpServletResponse response) {
        String refreshTokenValue = extractCookieValue(request, "refresh_token");
        if (refreshTokenValue != null) {
            refreshTokenRepository.findByToken(refreshTokenValue).ifPresent(
                    stored -> {
                        stored.setRevoked(true);
                        refreshTokenRepository.save(stored);
                    }
            );
        }

        deleteCookie(response, "admin_token");
        deleteCookie(response, "refresh_token");

        return ResponseEntity.ok(Map.of("message", "Sesión cerrada exitosamente"));
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(HttpServletRequest request) {
        String token = extractCookieValue(request, "admin_token");
        if (token == null || !jwtUtil.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "No autenticado"));
        }

        String username = jwtUtil.extractUsername(token);
        String nombreCompleto = adminUserRepository.findByUsername(username)
                .map(admin -> admin.getNombreCompleto())
                .orElse("");

        return ResponseEntity.ok(Map.of(
                "username", username,
                "nombreCompleto", nombreCompleto,
                "rol", jwtUtil.extractRole(token),
                "municipalidadId", jwtUtil.extractMunicipalidadId(token) != null
                        ? jwtUtil.extractMunicipalidadId(token).toString() : ""
        ));
    }

    private void setAccessTokenCookie(HttpServletResponse response, String token) {
        ResponseCookie cookie = ResponseCookie.from("admin_token", token)
                .httpOnly(true)
                .secure(true)
                .sameSite("None")
                .path("/")
                .maxAge(jwtUtil.getExpirationMs() / 1000)
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    private void setRefreshTokenCookie(HttpServletResponse response, String token) {
        ResponseCookie cookie = ResponseCookie.from("refresh_token", token)
                .httpOnly(true)
                .secure(true)
                .sameSite("None")
                .path("/")
                .maxAge(refreshExpirationMs / 1000)
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    private void deleteCookie(HttpServletResponse response, String name) {
        ResponseCookie cookie = ResponseCookie.from(name, "")
                .httpOnly(true)
                .secure(true)
                .sameSite("None")
                .path("/")
                .maxAge(0)
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    private void saveRefreshToken(String tokenValue, String username) {
        RefreshTokenModel refreshToken = new RefreshTokenModel();
        refreshToken.setToken(tokenValue);
        refreshToken.setUsername(username);
        refreshToken.setExpiresAt(LocalDateTime.now().plusSeconds(refreshExpirationMs / 1000));
        refreshToken.setCreatedAt(LocalDateTime.now());
        refreshToken.setRevoked(false);
        refreshTokenRepository.save(refreshToken);
    }

    private String extractCookieValue(HttpServletRequest request, String name) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (name.equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }
}
