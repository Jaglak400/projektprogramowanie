package magazyn.projekt.api.controllers;

import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import magazyn.projekt.api.model.Visit;
import magazyn.projekt.api.repos.UserRepo;
import magazyn.projekt.api.repos.VisitRepo;
import magazyn.projekt.config.TokenBasedAuthorizationHandler;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/visit")
@AllArgsConstructor
public class VisitController {
    VisitRepo visitRepo;
    UserRepo userRepo;
    TokenBasedAuthorizationHandler tokenBasedAuthorizationHandler;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('SERVICE')")
    public ResponseEntity<?> getClientServices(){
        return ResponseEntity.ok(visitRepo.findAll());
    }
    @GetMapping("/personal")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<?> getPersonalVisit(HttpServletRequest request) {
        var user = tokenBasedAuthorizationHandler.getUserFromHttpRequest(request);
        return ResponseEntity.ok(visitRepo.findAll().stream()
                .filter(v -> v
                        .getClient()
                        .getId()
                        .longValue() == user.getId().longValue()));
    }
    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('SERVICE')")
    public ResponseEntity<?> addVisit(@RequestParam("client") Long clientId,
                                      @RequestParam("date") String dateStr) {
        var clientOpt = userRepo.findById(clientId);
        if(clientOpt.isEmpty()){
            return ResponseEntity.notFound().build();
        }
        var client = clientOpt.get();
        var date = LocalDate.parse(dateStr);
        var visit = Visit.builder()
                .client(client)
                .date(date)
                .build();
        visit = visitRepo.save(visit);

        return ResponseEntity.ok(visit);
    }
}
