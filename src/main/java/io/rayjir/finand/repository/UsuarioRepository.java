package io.rayjir.finand.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import io.rayjir.finand.entity.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, UUID> {
    
    Usuario findByUsername(String username);
}
