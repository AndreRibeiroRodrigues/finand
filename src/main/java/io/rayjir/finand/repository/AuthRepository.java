package io.rayjir.finand.repository;

 import java.util.UUID;

 import io.rayjir.finand.entity.Auth;
 import org.springframework.data.jpa.repository.JpaRepository;

 public interface AuthRepository extends JpaRepository<Auth, UUID> {
    
 }
