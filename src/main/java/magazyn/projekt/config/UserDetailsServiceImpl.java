package magazyn.projekt.config;

import jakarta.transaction.Transactional;
import magazyn.projekt.api.model.user.User;
import magazyn.projekt.api.repos.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    @Autowired
    UserRepo userRepository;

    // Załadowanie użytkownika po jego nazwie i zwrócenie UserDetails
    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Wyszukiwanie użytkownika w bazie danych na podstawie nazwy użytkownika
        User user = userRepository.findUserByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found with username: " + username));
        // Konwersja znalezionego użytkownika na UserDetailsImpl i zwrócenie obiektu UserDetails
        return UserDetailsImpl.build(user);
    }
}
