package magazyn.projekt.api.repos;

import magazyn.projekt.api.model.part.ServicePart;
import org.springframework.data.jpa.repository.JpaRepository;
//zapewnia dostęp do wbudowanych metod do operacji CRUD na encji ServicePart
public interface ServicePartRepo extends JpaRepository<ServicePart, Long> {
}
