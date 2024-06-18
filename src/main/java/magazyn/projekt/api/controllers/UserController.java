package magazyn.projekt.api.controllers;

import jakarta.servlet.http.HttpServletRequest;
import lombok.Getter;
import lombok.Setter;
import magazyn.projekt.api.model.Role;
import magazyn.projekt.api.model.user.User;
import magazyn.projekt.api.model.user.UserRequest;
import magazyn.projekt.api.repos.RoleRepo;
import magazyn.projekt.api.repos.UserRepo;
import magazyn.projekt.config.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;

@RestController
// Wszystkie ścieżki w tej klasie zaczynają się od /api/user
@RequestMapping("/api/user")
public class UserController {
    // @Autowired automatycznie wstrzykują sie do klasy UserController
    @Autowired
    UserRepo userRepo;
    @Autowired
    RoleRepo roleRepo;
    @Autowired
    PasswordEncoder encoder;
    @Autowired
    private JwtUtils jwtUtils;

    // Metoda obsługująca żądanie GET na ścieżce /api/user
    @GetMapping
    @PreAuthorize("hasRole('WAREHOUSE') or hasRole('SERVICE') or hasRole('ADMIN')")
    public ResponseEntity<List<User>> getAllUsers(){
        return ResponseEntity.ok(userRepo.findAll());
    }

    // Metoda obsługująca żądanie POST na ścieżce /api/user/add
    @PostMapping("/add")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> addUserWithRoles(@RequestBody UserRequest userRequest, HttpServletRequest request) {
        System.out.println("Otrzymano żądanie użytkownika: " + userRequest);

        // Tworzenie nowego użytkownika na podstawie UserRequest
        User user = User.builder()
                .name(userRequest.getName())
                .surname(userRequest.getSurname())
                .username(userRequest.getUsername())
                .password(encoder.encode(userRequest.getPassword()))
                .roles(new HashSet<>())
                .build();

        // Przypisanie roli
        for (String roleName : userRequest.getRoles()) {
            Role role = roleRepo.findByName(Role.Type.valueOf(roleName));
            if (role != null) {
                user.getRoles().add(role);
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Rola nie znaleziona: " + roleName);
            }
        }
        userRepo.save(user);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    // Metoda obsługująca żądanie DELETE na ścieżce /api/user/{id}
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userRepo.deleteById(id);
        return ResponseEntity.ok().build();
    }

    // Metoda obsługująca żądanie PUT na ścieżce /api/user/{id}
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody UserRequest userRequest) {
        User user = userRepo.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        user.setName(userRequest.getName());
        user.setSurname(userRequest.getSurname());
        user.setUsername(userRequest.getUsername());

        // Podane hasło zostaje zakodowane
        if (userRequest.getPassword() != null && !userRequest.getPassword().isEmpty()) {
            user.setPassword(encoder.encode(userRequest.getPassword()));
        }

        // Przypisanie roli
        user.setRoles(new HashSet<>());
        for (String roleName : userRequest.getRoles()) {
            Role role = roleRepo.findByName(Role.Type.valueOf(roleName));
            if (role != null) {
                user.getRoles().add(role);
            }
            else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Rola nie znaleziona: " + roleName);
            }
        }

        userRepo.save(user);
        return ResponseEntity.ok().build();
    }

    // Metoda obsługująca żądanie GET na ścieżce /api/user/role
    @GetMapping("/role")
    @PreAuthorize("hasRole('SERVICE') or hasRole('ADMIN')")
    public ResponseEntity<?> getUsersByRole(@RequestParam("name") String roleStr){
        Role role = roleRepo.findByName(Role.Type.valueOf(roleStr));
        if(role == null)
            return ResponseEntity.badRequest().body("Role was " + role);

        // Filtruje i zwraca użytkowników którzy mają podaną rolę
        return ResponseEntity.ok(
                userRepo.findAll().stream().filter(
                        user -> user.getRoles().contains(role)
                )
        );
    }
}
