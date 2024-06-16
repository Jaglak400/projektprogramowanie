package magazyn.projekt.api.controllers;

import magazyn.projekt.api.model.user.LoginRequest;
import magazyn.projekt.api.model.user.LoginResponse;
import magazyn.projekt.api.repos.UserRepo;
import magazyn.projekt.config.JwtUtils;
import magazyn.projekt.config.TokenBasedAuthorizationHandler;
import magazyn.projekt.config.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

// Wszystkie ścieżki w tej klasie zaczynają się od /api/auth
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    // @Autowired automatycznie wstrzykują sie do klasy UserController
    @Autowired
    UserRepo userRepo;
    @Autowired
    AuthenticationManager authenticationManager;
    @Autowired
    JwtUtils jwtUtils;
    @Autowired
    TokenBasedAuthorizationHandler authorizationHandler;

    // Metoda obsługująca żądanie GET dla scieżki /api/auth/roles
    @GetMapping("/roles")
    public ResponseEntity<?> getUserRoles() {
        // Pobranie szczegółowych informacji o zalogowanym użytkowniku
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        // Pobranie ról przypisanych do użytkownika
        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority()) // Mapowanie roli do nazwy
                .collect(Collectors.toList()); // Zbieranie wyników do listy
        return ResponseEntity.ok(roles);
    }

    // Metoda obsługująca żądanie POST dla endpointu /login która pozwala użytkownikowi zalogować się do systemu
    @PostMapping("/login")
    public ResponseEntity<?> Login(@RequestBody LoginRequest loginRequest) {
        // Autentykacja użytkownika na podstawie przekazanych danych logowania
        Authentication authentication = authenticationManager
                .authenticate(new UsernamePasswordAuthenticationToken(loginRequest.username, loginRequest.password));
        // Ustawienie kontekstu autentykacji w SecurityContextHolder
        SecurityContextHolder.getContext().setAuthentication(authentication);
        // Pobranie szczegółów użytkownika po autentykacji
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        // Sprawdzenie czy użytkownik istnieje w repozytorium
        var userOpt = userRepo.findById(userDetails.getId());

        if(userOpt.isEmpty())
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        // Generowanie ciasteczka JWT i ustawienie go w nagłówku odpowiedzi
        ResponseCookie jwtCookie = jwtUtils.generateJwtCookie(userDetails);

        // Pobranie ról użytkownika
        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());
        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
                .body(new LoginResponse(userDetails.getId(),  userDetails.getUsername(), roles));
    }

    // Metoda obsługująca żądanie GET dla endpointu /logout która wylogowuje użytkownika z systemu
    @GetMapping("/logout")
    public ResponseEntity<?> Logout(){
        // Pobranie pustego ciasteczka JWT i ustawienie go w nagłówku odpowiedzi co wylogowuje użytkownika
        ResponseCookie cookie = jwtUtils.getCleanJwtCookie();
        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookie.toString()).build();
    }
}