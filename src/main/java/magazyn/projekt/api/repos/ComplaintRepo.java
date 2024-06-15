package magazyn.projekt.api.repos;

import magazyn.projekt.api.model.Complaint;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ComplaintRepo extends JpaRepository<Complaint, Long> {
}
