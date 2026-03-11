package net.arkteam.finesysteam.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "locations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Location {

    @Id
    private String id;

    private String stockName;      // Nome do Estoque
    private String location;       // Localização
    private Integer totalCapacity; // Capacidade Total
    private String description;    // Descrição
}