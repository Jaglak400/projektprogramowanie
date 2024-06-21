package magazyn.projekt.api.repos;

import magazyn.projekt.api.model.Visit;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VisitRepo extends JpaRepository<Visit, Long> {
}
