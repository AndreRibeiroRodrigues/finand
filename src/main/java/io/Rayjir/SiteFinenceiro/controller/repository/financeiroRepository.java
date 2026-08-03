package io.Rayjir.SiteFinenceiro.controller.repository;

import io.Rayjir.SiteFinenceiro.entity.Despesa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface financeiroRepository extends JpaRepository<Despesa, Despesa> {

}
