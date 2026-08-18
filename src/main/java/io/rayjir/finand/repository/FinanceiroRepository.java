package io.rayjir.finand.repository;

import java.util.UUID;

import io.rayjir.finand.entity.Despesa;
import org.springframework.data.jpa.repository.JpaRepository;


public interface FinanceiroRepository extends JpaRepository<Despesa, UUID> {


}