package io.Rayjir.SiteFinenceiro.controller;

import io.Rayjir.SiteFinenceiro.Repository.FinanceiroRepository;
import io.Rayjir.SiteFinenceiro.entity.Despesa;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.UUID;
import org.springframework.web.bind.annotation.PutMapping;





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

    @PostMapping("postDespesa")
    public ResponseEntity<Despesa> postDespesa(@RequestBody Despesa entity) {
        //TODO: process POST request
        Despesa despesaSalva = financeiroRepository.save(entity);
        System.out.println("Despesa recebida: " + despesaSalva);
        return new ResponseEntity<>(despesaSalva, HttpStatus.CREATED);
    }

    @DeleteMapping
    public String deletePath(@RequestBody int id){
        return "Despesa deletada";
    }
}
