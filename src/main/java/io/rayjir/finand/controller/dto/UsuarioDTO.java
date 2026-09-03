package io.rayjir.finand.controller.dto;

import java.util.List;

public record UsuarioDTO(String username, String senha, List<String> roles) {
    
}
