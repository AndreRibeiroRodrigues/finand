package io.rayjir.sitefinanceiro.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.rayjir.sitefinanceiro.entity.Despesa;
import io.rayjir.sitefinanceiro.repository.FinanceiroRepository;


@RestController
@RequestMapping("/api/despesas")
public class FinanceiroController {

    private final FinanceiroRepository financeiroRepository;

    public FinanceiroController(FinanceiroRepository financeiroRepository) {
        this.financeiroRepository = financeiroRepository;
    }


    @GetMapping("/get")
    public ResponseEntity<List<Despesa>> getDespesas() {
        System.out.println("get");
        return ResponseEntity.ok(financeiroRepository.findAll());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Despesa> getDespesa(@PathVariable("id") UUID id) {
        Despesa despesa = financeiroRepository.findById(id).orElse(null);
        if (despesa == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(despesa, HttpStatus.OK);
    }

    @PostMapping("/postDespesa")
    public ResponseEntity<Despesa> postDespesa(@RequestBody Despesa entity) {
        System.out.println("Despesa recebida: " + entity);
        Despesa despesaSalva = financeiroRepository.save(entity);
        return new ResponseEntity<>(despesaSalva, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Despesa> putDespesa(
            @PathVariable("id") UUID id,
            @RequestBody Despesa dadosAtualizados) {
        return financeiroRepository.findById(id)
                .map(despesa -> {
                    despesa.setDate(dadosAtualizados.getDate());
                    despesa.setCategory(dadosAtualizados.getCategory());
                    despesa.setSubcategory(dadosAtualizados.getSubcategory());
                    despesa.setDescription(dadosAtualizados.getDescription());
                    despesa.setValue(dadosAtualizados.getValue());
                    despesa.setStatus(dadosAtualizados.getStatus());
                    despesa.setPaymentMethod(dadosAtualizados.getPaymentMethod());
                    despesa.setObservation(dadosAtualizados.getObservation());
                    return ResponseEntity.ok(financeiroRepository.save(despesa));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDespesa(@PathVariable("id") UUID id) {
        if (!financeiroRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        financeiroRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
