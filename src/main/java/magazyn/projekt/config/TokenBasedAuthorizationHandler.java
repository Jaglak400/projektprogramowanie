package magazyn.projekt.config;

import jakarta.servlet.http.HttpServletRequest;
import magazyn.projekt.api.model.user.User;
import magazyn.projekt.api.repos.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TokenBasedAuthorizationHandler {
    @Autowired
    UserRepo userRepo;
    @Autowired
    JwtUtils jwtUtils;

    // Wyciągniecie użytkownika bezpośrednio z requesta http
    public User getUserFromHttpRequest(HttpServletRequest request) {
        var cookie = jwtUtils.getJwtFromCookies(request);
        if (cookie != null) {
            String username = jwtUtils.getUserNameFromJwtToken(cookie);
            // Wyszukiwanie użytkownika
            User user = userRepo.findUserByUsername(username).orElse(null);
            return user;
        }
        // Zwracanie null jeśli token JWT nie jest obecny w żądaniu
        return null;
    }
}
