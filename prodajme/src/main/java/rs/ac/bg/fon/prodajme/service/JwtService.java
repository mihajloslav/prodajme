package rs.ac.bg.fon.prodajme.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;
import rs.ac.bg.fon.prodajme.entity.User;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class JwtService {

    // Tajni ključ koji se koristi za potpisivanje JWT tokena
    private static final String SECRET_STRING =
            "thisisaverylongandsecuresecretkeyusedforprodajmejwtgenerationthisisaverylongandsecuresecretkeyusedforprodajmejwtgeneration";

    // Token važi 24 sata
    private static final long EXPIRATION_TIME = 86400000;

    private final SecretKey key;

    public JwtService() {
        // Kreiranje SecretKey objekta na osnovu zadatog tajnog ključa
        this.key = Keys.hmacShaKeyFor(SECRET_STRING.getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(User user) {

        // Podaci koji će biti sačuvani u JWT tokenu
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", user.getId());
        claims.put("role", user.getRole().name());

        return Jwts.builder()
                .claims(claims)
                .subject(user.getEmail())               // Email predstavlja identitet korisnika
                .issuedAt(new Date())                  // Vreme kreiranja tokena
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(key)                         // Digitalno potpisivanje tokena
                .compact();
    }

    // Vraća email korisnika iz JWT tokena
    public String extractEmail(String token) {
        return extractAllClaims(token).getSubject();
    }

    // Vraća ulogu korisnika iz JWT tokena
    public String extractRole(String token) {
        return extractAllClaims(token).get("role", String.class);
    }

    // Vraća ID korisnika iz JWT tokena
    public Integer extractUserId(String token) {
        return extractAllClaims(token).get("userId", Integer.class);
    }

    // Proverava da li je token validan i da li nije istekao
    public boolean isTokenValid(String token) {
        try {
            Claims claims = extractAllClaims(token);
            return !claims.getExpiration().before(new Date());
        } catch (Exception e) {
            return false;
        }
    }

    // Čita sve podatke (claims) iz JWT tokena
    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(key)          // Provera digitalnog potpisa
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}