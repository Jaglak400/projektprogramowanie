package magazyn.projekt.api.repos;

import magazyn.projekt.api.model.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

//zapewnia dostęp do wbudowanych metod do operacji CRUD na encji User
public interface UserRepo extends JpaRepository<User, Long> {
    Optional<User> findUserByUsername(String username);
}