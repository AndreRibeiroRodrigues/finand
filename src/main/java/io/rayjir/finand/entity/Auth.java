package io.Rayjir.finand.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

/**
 * Auth
 */

@Getter
@Setter
@Entity
@Table
public class Auth {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @JoinColumn()
    @OneToOne()
    private Usuario user;
    @Column
    private String username;
    @Column
    private String password;
    @Column
    private String token;
    
}