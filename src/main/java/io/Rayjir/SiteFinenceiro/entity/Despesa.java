package io.Rayjir.SiteFinenceiro.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import java.util.Date;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;


@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@Entity
@Table(name="despesas")
public class Despesa {
    
    @Id
    @GeneratedValue(strategy=GenerationType.UUID)
    private UUID id;
    @Column(nullable = false)
    private Date date;
    @Column(nullable=false)
    private String despesa;
    @Column(nullable=false)
    private Double valor;
    @Column(nullable=false)
    private FormaPagamento formaPagamento;
    @Column(nullable=false)
    private Status status;
    @Column
    private String observacao;

}
