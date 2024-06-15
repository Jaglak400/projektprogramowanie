package magazyn.projekt.api.repos;

import magazyn.projekt.api.model.part.Part;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
//zapewnia dostęp do wbudowanych metod do operacji CRUD na encji Part
public interface PartRepo extends JpaRepository<Part, Long> {
    //metoda wyszukiwania części po jej nazwie
    Optional<Part> findPartByName(String name);
//    nie tykac bo jebnie
    List<Part> findAllByOrderByIdAsc();
}
