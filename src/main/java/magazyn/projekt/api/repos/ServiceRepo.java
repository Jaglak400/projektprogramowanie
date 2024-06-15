package magazyn.projekt.api.repos;

import magazyn.projekt.api.model.service.Service;
import org.springframework.data.jpa.repository.JpaRepository;

//zapewnia dostęp do wbudowanych metod do operacji CRUD na encji Service
public interface ServiceRepo extends JpaRepository<Service, Long> {
}
