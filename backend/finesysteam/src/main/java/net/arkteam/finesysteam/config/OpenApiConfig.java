package net.arkteam.finesysteam.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
        info = @Info(
                title = "Sorvete Store API",
                version = "v1",
                description = "Documentação dos endpoints da Sorvete Store"
        )
)
public class OpenApiConfig {
}
