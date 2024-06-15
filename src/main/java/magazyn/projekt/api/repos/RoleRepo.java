package magazyn.projekt.api.repos;

import magazyn.projekt.api.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleRepo extends JpaRepository<Role, Long> {
    //metoda do wyszukiwania roli po jej nazwie
    Role findByName(Role.Type name);
}