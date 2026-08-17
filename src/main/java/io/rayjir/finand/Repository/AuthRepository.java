package io.Rayjir.finand.repository;

 import java.util.UUID;

 import io.Rayjir.finand.entity.Auth;
 import org.springframework.data.jpa.repository.JpaRepository;

 public interface AuthRepository extends JpaRepository<Auth, UUID> {
    
 }
