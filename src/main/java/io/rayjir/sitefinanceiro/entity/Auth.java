package io.rayjir.sitefinanceiro.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

/**
 * Auth
 */

@Getter
@Setter
// @Entity
// @Table(name = "auth")
public class Auth {
    
    private String id;
    private String username;
    private String password;
    private String token;
    
}