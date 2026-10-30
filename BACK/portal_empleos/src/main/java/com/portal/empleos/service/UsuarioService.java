package com.portal.empleos.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.portal.empleos.model.Usuario;
import com.portal.empleos.repository.UsuarioRepository;

@Service
public class UsuarioService {

    private final UsuarioRepository repository;

    public UsuarioService(UsuarioRepository repository) {
        this.repository = repository;
    }

    public Usuario crearUsuario(Usuario usuario) {
        return repository.save(usuario);
    }

    public List<Usuario> obtenerTodos() {
        return repository.findAll();
    }

    public Optional<Usuario> obtenerPorId(Long id) {
        return repository.findById(id);
    }

    public Usuario actualizarUsuario(Long id, Usuario usuarioActualizado) {
        return repository.findById(id).map(usuario -> {
            usuario.setEmail(usuarioActualizado.getEmail());
            usuario.setPassword(usuarioActualizado.getPassword());
            usuario.setRolId(usuarioActualizado.getRolId());
            return repository.save(usuario);
        }).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    public void eliminarUsuario(Long id) {
        repository.deleteById(id);
    }

    public Optional<Usuario> autenticar(String email, String password) {
        return repository.findByEmail(email)
                .filter(u -> u.getPassword().equals(password));
    }
}