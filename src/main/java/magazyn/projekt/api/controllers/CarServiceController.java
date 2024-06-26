package magazyn.projekt.api.controllers;

import lombok.AllArgsConstructor;
import magazyn.projekt.api.model.car_services.CarService;
import magazyn.projekt.api.model.car_services.CarServiceRequest;
import magazyn.projekt.api.repos.CarServiceRepo;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/car-service")
@AllArgsConstructor
public class CarServiceController {
    CarServiceRepo carServiceRepo;

    // Pobranie wszystkich usług
    @GetMapping
    @PreAuthorize("hasRole('SERVICE') or hasRole('ADMIN')")
    public ResponseEntity<?> getAllCarService() {
        var carServices = carServiceRepo.findAll();
        return ResponseEntity.ok(carServices);
    }

    // Dodanie nowej usługi samochodowej
    @PostMapping
    @PreAuthorize("hasRole('SERVICE') or hasRole('ADMIN')")
    public ResponseEntity<?> addNewCarService(@RequestBody CarServiceRequest carServiceRequest) {
        var carRequest = CarService.builder()
                .name(carServiceRequest.name)
                .price(carServiceRequest.price)
                .build();
        carRequest = carServiceRepo.save(carRequest);
        return ResponseEntity.ok(carRequest);
    }

    // Usunięcie usługi samochodowej
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SERVICE') or hasRole('ADMIN')")
    public ResponseEntity<?> deleteCarService(@PathVariable("id") Long id) {
        var carService = carServiceRepo.findById(id);
        if (carService.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        carServiceRepo.deleteById(id);
        return ResponseEntity.ok().build();
    }

    // Aktualizacja usługi samochodowej
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('SERVICE') or hasRole('ADMIN')")
    public ResponseEntity<?> updateCarService(@PathVariable("id") Long id, @RequestBody CarServiceRequest carServiceRequest) {
        var carServiceOpt = carServiceRepo.findById(id);
        if (carServiceOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        var carService = carServiceOpt.get(); // Pobranie istniejącej usługi
        carService = carService.toBuilder()
                .name(carServiceRequest.name) // Aktualizacja nazwy usługi
                .price(carServiceRequest.price) // Aktualizacja ceny usługi
                .build();
        carServiceRepo.save(carService); // Zapisanie zaktualizowanej usługi do repozytorium
        return ResponseEntity.ok(carService);
    }
}