package io.Rayjir.SiteFinenceiro.Repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import io.Rayjir.SiteFinenceiro.entity.Despesa;

public interface FinanceiroRepository extends JpaRepository<Despesa, UUID> {


}
