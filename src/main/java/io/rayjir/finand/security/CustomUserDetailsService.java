package io.rayjir.finand.security;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import io.rayjir.finand.entity.Usuario;
import io.rayjir.finand.service.UsuarioService;

public class CustomUserDetailsService implements UserDetailsService{

    private final UsuarioService service = null;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Usuario usuario = service.getUsuario(username);

        if(usuario == null){
            throw new UsernameNotFoundException("Usuario nao encontrado");
        }
        
        return null;
    }
    
}