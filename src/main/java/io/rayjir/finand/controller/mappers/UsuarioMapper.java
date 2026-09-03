package io.rayjir.finand.controller.mappers;

import org.mapstruct.Mapper;

import io.rayjir.finand.controller.dto.UsuarioDTO;
import io.rayjir.finand.entity.Usuario;

@Mapper( componentModel = "spring")
public interface UsuarioMapper {
    
    Usuario toEntity(UsuarioDTO dto);
}
