package io.rayjir.finand.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import io.rayjir.finand.entity.Usuario;
import io.rayjir.finand.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UsuarioService {
    
    private final UsuarioRepository repository;
    private final PasswordEncoder encoder;

    public void salvar(Usuario usuario){
        usuario.setPassword(encoder.encode(usuario.getPassword()));
        repository.save(usuario);
    }

    public Usuario getUsuario(String username){
        return repository.findByUsername(username);
    }
}
