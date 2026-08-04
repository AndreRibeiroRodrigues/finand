package io.Rayjir.SiteFinenceiro.controller;

import io.Rayjir.SiteFinenceiro.entity.Despesa;

import org.springframework.http.HttpStatus;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;



@RestController
@RequestMapping("/despesa")
public class FinanceiroController {

    @GetMapping("/get")
    public RequestEntity<Despesa> listarDespesa(@RequestParam int param) {
        
        
        return null;
    }
    

    @PostMapping("postDespesa")
    public ResponseEntity<Despesa> postDespesa(@RequestBody Despesa entity) {
        //TODO: process POST request
        
        return new ResponseEntity<>(entity, HttpStatus.CREATED);
    }
    

    @DeleteMapping
    public String deletePath(@RequestBody int id){

        return "Despesa deletada";
    }
}
