package io.Rayjir.SiteFinenceiro.controller;

import io.Rayjir.SiteFinenceiro.entity.Despesa;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/despesa")
public class FinanceiroController {

    @GetMapping
    public String getDespesa(){

        return null;

    }
}
