package net.arkteam.finesysteam.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "categories")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Category {

    @Id
    private String id;

    private String name;            // Nome da categoria
    private String description;     // Descrição detalhada

    @DBRef
    private Category parentCategory; // Categoria pai, para hierarquia (opcional)
}
