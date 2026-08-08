package io.rayjir.sitefinanceiro.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import io.rayjir.sitefinanceiro.entity.Despesa;

public interface FinanceiroRepository extends JpaRepository<Despesa, UUID> {


}