package magazyn.projekt.api.controllers;

import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import magazyn.projekt.api.repos.ServiceRepo;
import magazyn.projekt.api.repos.UserRepo;
import magazyn.projekt.config.TokenBasedAuthorizationHandler;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// Wszystkie ścieżki w tej klasie zaczynają się od /api/client
@AllArgsConstructor
@RestController
@RequestMapping("/api/client")
public class ClientController {
    private UserRepo userRepo;
    private ServiceRepo serviceRepo;
    private TokenBasedAuthorizationHandler authorizationHandler;

    // Metoda obsługująca żądanie GET na ścieżce /api/client/services
    @PreAuthorize("hasRole('CLIENT') OR hasRole('ADMIN')")
    @GetMapping("/services")
    public ResponseEntity<?> getClientServices(HttpServletRequest request){
        // Pobiera użytkownika z żądania HTTP za pomocą procedury autoryzacji
        var user = authorizationHandler.getUserFromHttpRequest(request);
        if(user == null){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        // Zwraca obiekt ResponseEntity zawierający usługi klienta jeśli użytkownik jest uwierzytelniony.
        return ResponseEntity.ok(user.getClientServices());
    }
}
