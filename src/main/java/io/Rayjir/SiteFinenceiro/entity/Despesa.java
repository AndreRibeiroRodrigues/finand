package io.Rayjir.SiteFinenceiro.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.UUID;

@Entity
@Getter
@Setter
@Table
public class Despesa {
    @Column
    private UUID id;
    @Column
    private Date date;
    @Column
    private String despesa;
    @Column
    private Double valor;
    @Column
    private FormaPagamento formaPagamento;
    @Column
    private String observacao;
    @Column
    private Status status;

}
