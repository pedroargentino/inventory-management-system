package net.arkteam.finesysteam.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "buy_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BuyList {

    @Id
    private String id;

    private double quantity;

    private String unit;

    private String reason;

    private boolean purchased = false;

    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime purchasedAt;
}
