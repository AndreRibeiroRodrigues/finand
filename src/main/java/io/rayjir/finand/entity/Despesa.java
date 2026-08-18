package io.rayjir.finand.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import java.util.Date;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
    @Column(name = "usuario_id")
    private UUID usuarioId;
    @Column()
    private Date date;
    @Column()
    private String category;
    @Column()
    private String subcategory;
    @Column()
    private String description;
    @Column()
    private double value;
    @Enumerated(EnumType.STRING)
    @Column()
    private Status status;
    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method")
    private FormaPagamento paymentMethod;
    @Column()
    private String observation;

}
