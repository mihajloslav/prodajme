package rs.ac.bg.fon.prodajme.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {

        // Dozvoljava CORS zahteve za sve rute u aplikaciji
        registry.addMapping("/**")

                // Frontend aplikacije kojima je dozvoljen pristup backendu
                .allowedOrigins(
                        "http://localhost:5173",
                        "http://localhost:3000"
                )

                // Dozvoljene HTTP metode
                .allowedMethods(
                        "GET",
                        "POST",
                        "PUT",
                        "DELETE",
                        "OPTIONS"
                )

                // Dozvoljava sva HTTP zaglavlja
                .allowedHeaders("*")

                // Ne dozvoljava slanje kolačića i drugih kredencijala
                .allowCredentials(false);
    }
}