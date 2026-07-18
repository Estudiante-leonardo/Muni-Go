package com.tramites.backend.infrastructure.config;

import com.tramites.backend.domain.model.AdminUser;
import com.tramites.backend.domain.ports.out.AdminUserRepositoryPort;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final AdminUserRepositoryPort adminUserRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(AdminUserRepositoryPort adminUserRepository, PasswordEncoder passwordEncoder) {
        this.adminUserRepository = adminUserRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // Super Admin
        if (!adminUserRepository.existsByUsername("superAdmin")) {
            AdminUser superAdmin = new AdminUser();
            superAdmin.setUsername("superAdmin");
            superAdmin.setPasswordHash(passwordEncoder.encode("password"));
            superAdmin.setNombreCompleto("Administrador General");
            superAdmin.setRol("SUPER_ADMIN");
            superAdmin.setMunicipalidadId(null);
            superAdmin.setActivo(true);
            adminUserRepository.save(superAdmin);
            log.info("Usuario Super Admin creado: superAdmin");
        }

        // Admin Municipal de Carabayllo
        if (!adminUserRepository.existsByUsername("admin")) {
            AdminUser admin = new AdminUser();
            admin.setUsername("admin");
            admin.setPasswordHash(passwordEncoder.encode("password"));
            admin.setNombreCompleto("Administrador de Carabayllo");
            admin.setRol("ADMIN_MUNICIPAL");
            admin.setMunicipalidadId(1L); // Carabayllo
            admin.setActivo(true);
            adminUserRepository.save(admin);
            log.info("Usuario Admin Municipal creado: admin (Carabayllo)");
        }
    }
}
