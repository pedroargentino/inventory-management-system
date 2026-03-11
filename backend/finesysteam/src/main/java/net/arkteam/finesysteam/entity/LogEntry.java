package net.arkteam.finesysteam.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "logs")
public class LogEntry {

    @Id
    private String id;

    private String action;           // ex: CREATE_STOCK, DELETE_STOCK, etc.
    private String entityName;       // ex: Stock, Category, Location
    private String entityId;         // ID do objeto afetado
    private String performedBy;      // email ou id do usuário (pode ser null se não autenticado)
    private LocalDateTime timestamp; // hora da ação
    private String details;          // detalhes adicionais da ação
}
