package magazyn.projekt.api.repos;

import magazyn.projekt.api.model.car_services.CarService;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CarServiceRepo extends JpaRepository<CarService, Long> {
}
