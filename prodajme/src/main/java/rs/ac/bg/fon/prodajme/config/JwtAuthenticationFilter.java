package rs.ac.bg.fon.prodajme.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import rs.ac.bg.fon.prodajme.repository.UserRepository;
import rs.ac.bg.fon.prodajme.service.JwtService;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    public JwtAuthenticationFilter(JwtService jwtService, UserRepository userRepository) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        // Čitanje Authorization zaglavlja iz HTTP zahteva
        String authHeader = request.getHeader("Authorization");

        // Ako token nije prosleđen ili nije Bearer format, zahtev se samo prosleđuje dalje
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Uklanja se prefiks "Bearer " i ostaje samo JWT token
        String jwt = authHeader.substring(7);

        // Provera da li je token validan i da li nije istekao
        if (jwtService.isTokenValid(jwt)) {

            // Iz tokena se uzima email korisnika
            String email = jwtService.extractEmail(jwt);

            // Proverava se da li korisnik već nije autentifikovan
            if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {

                // Pronalaženje korisnika u bazi na osnovu email adrese
                userRepository.findByEmail(email).ifPresent(user -> {

                    // Dozvoljava prijavu samo verifikovanim korisnicima
                    if (Boolean.TRUE.equals(user.getEnabled())) {

                        // Kreiranje Spring Security autentifikacije
                        UsernamePasswordAuthenticationToken authToken =
                                new UsernamePasswordAuthenticationToken(
                                        user,
                                        null,
                                        Collections.singletonList(
                                                new SimpleGrantedAuthority("ROLE_" + user.getRole().name())
                                        )
                                );

                        // Dodavanje informacija o trenutnom HTTP zahtevu
                        authToken.setDetails(
                                new WebAuthenticationDetailsSource().buildDetails(request)
                        );

                        // Čuvanje autentifikacije u SecurityContext-u
                        SecurityContextHolder.getContext().setAuthentication(authToken);
                    }
                });
            }
        }

        // Nastavlja izvršavanje sledećeg filtera ili kontrolera
        filterChain.doFilter(request, response);
    }
}