package net.arkteam.finesysteam.entity;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "stock")
public class Stock {

    @Id
    private String id;

    @NotBlank
    @Indexed(unique = true)
    private String itemName;

    @NotNull
    @Min(0)
    private Integer quantity;

    @NotBlank
    private String unit;

    @NotNull
    private LocalDate expirationDate;

    @NotNull
    @Min(0)
    private Integer minimumStock;

    @NotNull
    @DBRef(lazy = true)
    private Location location;

    @NotNull
    @DBRef(lazy = true)
    private Category category;
}
