package rs.ac.bg.fon.prodajme.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                // Podešavanje CORS konfiguracije
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                // Isključuje CSRF zaštitu jer aplikacija koristi JWT autentifikaciju
                .csrf(csrf -> csrf.disable())
                // Aplikacija ne koristi HTTP sesije, već JWT token
                .sessionManagement(session
                        -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                // Definisanje pravila pristupa API rutama
                .authorizeHttpRequests(auth -> auth
                // Javno dostupne rute
                .requestMatchers(HttpMethod.POST, "/api/users/login").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/users").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/users/verify").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/users/forgot-password").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/users/reset-password").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/products/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/categories/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/cities/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/uploads/**").permitAll()
                // Sve ostale rute zahtevaju prijavljenog korisnika
                .anyRequest().authenticated()
                )
                // JWT filter se izvršava pre standardnog Spring filtera za prijavu
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        // Dozvoljeni frontend serveri
        configuration.setAllowedOrigins(
                Arrays.asList(
                        "http://localhost:5173",
                        "http://localhost:3000"
                )
        );

        // Dozvoljene HTTP metode
        configuration.setAllowedMethods(
                Arrays.asList(
                        "GET",
                        "POST",
                        "PUT",
                        "DELETE",
                        "OPTIONS"
                )
        );

        // Dozvoljava sva zaglavlja
        configuration.setAllowedHeaders(Arrays.asList("*"));

        // Ne dozvoljava korišćenje kolačića i drugih kredencijala
        configuration.setAllowCredentials(false);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

        // Primena CORS pravila na sve rute
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}
