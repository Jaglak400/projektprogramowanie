package magazyn.projekt.api.controllers;

import jakarta.servlet.http.HttpServletRequest;
import magazyn.projekt.api.model.business.PartService;
import magazyn.projekt.api.model.car_services.CarService;
import magazyn.projekt.api.model.part.Part;
import magazyn.projekt.api.model.part.PartAmountRequest;
import magazyn.projekt.api.model.part.ServicePart;
import magazyn.projekt.api.model.service.Service;
import magazyn.projekt.api.repos.*;
import magazyn.projekt.config.JwtUtils;
import magazyn.projekt.config.TokenBasedAuthorizationHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
// Wszystkie ścieżki w tej klasie zaczynają się od /api/service
@RequestMapping("/api/service")
public class ServiceController {
    // @Autowired automatycznie wstrzykują sie do klasy ServiceController
    @Autowired
    ServiceRepo serviceRepo;
    @Autowired
    UserRepo userRepo;
    @Autowired
    private JwtUtils jwtUtils;
    @Autowired
    private TokenBasedAuthorizationHandler tokenBasedAuthorizationHandler;
    @Autowired
    private PartService partService;
    @Autowired
    private PartRepo partRepo;
    @Autowired
    private ServicePartRepo servicePartRepo;
    @Autowired
    private CarServiceRepo carServiceRepo;

    // Metoda obsługująca żądanie GET na ścieżce /api/service
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllServices(){
        return ResponseEntity.ok(serviceRepo.findAll());
    }

    // Metoda obsługująca żądanie POST na ścieżce /api/service/assign
    @PostMapping("/assign")
    @PreAuthorize("hasRole('SERVICE') OR hasRole('ADMIN')")
    public ResponseEntity<?> assignServiceManToService(@RequestParam("service") Long serviceId,
                                                       @RequestParam("serviceMan") Long serviceManId){
        // Pobiera serwisanta i usługę na podstawie przekazanych identyfikatorów
        var serviceOpt = serviceRepo.findById(serviceId);
        var serviceManOpt = userRepo.findById(serviceManId);

        // Jeśli nie ma takiej usługi lub serwisanta zwraca błąd 404
        if(serviceOpt.isEmpty() || serviceManOpt.isEmpty()){
            return ResponseEntity.notFound().build();
        }

        // Pobiera obiekty usługi i serwisanta
        var service = serviceOpt.get();
        var serviceMan = serviceManOpt.get();

        // Przypisuje serwisanta do usługi
        service.setServiceMan(serviceMan);
        serviceMan.getServiceManServices().add(service);
        serviceRepo.save(service);
        userRepo.save(serviceMan);

        return ResponseEntity.ok().build();
    }

    // Metoda obsługująca żądanie POST na ścieżce /api/service
    @PostMapping
    @PreAuthorize("hasRole('SERVICE') OR hasRole('ADMIN')")
    public ResponseEntity<?> addNewService(@RequestParam("description") String description,
                                           @RequestParam("client") Long clientId){
        var clientOpt = userRepo.findById(clientId);

        if(clientOpt.isEmpty()){
            return ResponseEntity.notFound().build();
        }

        // Tworzy nową usługę na podstawie opisu i klienta
        var client = clientOpt.get();
        var service = Service.builder()
                .description(description)
                .client(client)
                .status(Service.Status.UNDERTAKING)
                .build();
        var addedService = serviceRepo.save(service);

        return ResponseEntity.ok().body(addedService.getId());
    }

    // Metoda obsługująca żądanie DELETE na ścieżce /api/service
    @DeleteMapping
    @PreAuthorize("hasRole('SERVICE') OR hasRole('ADMIN')")
    public ResponseEntity<?> removeService(@RequestParam("service") Long serviceId) {
        var service = serviceRepo.findById(serviceId);
        if(service.isEmpty()){
            return ResponseEntity.notFound().build();
        }
        serviceRepo.delete(service.get());
        return ResponseEntity.ok().build();
    }

    // Metoda obsługująca żądanie POST na ścieżce /api/service/set/status
    @PostMapping("/set/status")
    @PreAuthorize("hasRole('SERVICE') or hasRole('ADMIN')")
    public ResponseEntity<?> setStatus(@RequestParam("service") Long serviceId, @RequestParam("status") String status) {
        // Pobranie usługi z repozytorium na podstawie identyfikatora
        var service = serviceRepo.findById(serviceId).orElseThrow();
        try {
            // Konwersja statusu na wartość wyliczeniową i ustawienie nowego statusu usługi
            Service.Status newStatus = Service.Status.valueOf(status.toUpperCase());
            service.setStatus(newStatus);
            serviceRepo.save(service);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Metoda obsługująca żądanie POST na ścieżce /api/service/my/work
    @PostMapping("/my/work")
    @PreAuthorize("hasRole('SERVICE') or hasRole('ADMIN')")
    public ResponseEntity<?> getServiceService(HttpServletRequest request) {
        var user = tokenBasedAuthorizationHandler.getUserFromHttpRequest(request);
        //TODO jak się rozjebie to tu jest problem
//        if(user == null){
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
//        }
        var allServices = serviceRepo.findAll();
        var userServices = allServices.stream().filter((s) -> s.getServiceMan().getId().longValue() == user.getId().longValue());

        return ResponseEntity.ok(userServices);
    }

    // Metoda obsługująca żądanie POST na ścieżce /api/service/{serviceId}/parts
    @PostMapping("/{serviceId}/parts")
    @PreAuthorize("hasRole('SERVICE') OR hasRole('ADMIN')")
    public ResponseEntity<?> assignPartsToService(@PathVariable Long serviceId, @RequestBody PartAmountRequest[] partAmountRequests) {
        var serviceOpt = serviceRepo.findById(serviceId);
        if(serviceOpt.isEmpty()){
            return ResponseEntity.notFound().build();
        }
        var service = serviceOpt.get();
        // TODO potencjalne miesce katastrofy ;D
        // Pobiera identyfikatory części z tablicy partAmountRequests
        var partIds = Arrays.stream(partAmountRequests)
                .map(partAmountRequest -> partAmountRequest.partId)
                .toList();

        // Pobiera części na podstawie ich identyfikatorów
        var parts = partRepo.findAllById(partIds);

        Set<ServicePart> partsSet = new HashSet<>();

        // Przypisuje części do usługi i aktualizuje stan magazynowy
        for(var i = 0; i < parts.size(); i++){
            partsSet.add(ServicePart.builder()
                    .part(parts.get(i))
                    .count(partAmountRequests[i].amount)
                    .build()
            );
            parts.get(i).setInStock(parts.get(i).getInStock() - partAmountRequests[i].amount);
        }

        // Zapisuje zmiany w częściach i ich przypisaniu do usługi
        partRepo.saveAll(parts);

        var pSet = servicePartRepo.saveAll(partsSet);
        service.setServiceParts(partsSet);

        serviceRepo.save(service);
        return ResponseEntity.ok().build();
    }

    // Metoda obsługująca żądanie GET na ścieżce /api/service/all
    @GetMapping("/all")
    @PreAuthorize("hasRole('SERVICE') OR hasRole('ADMIN')")
    public ResponseEntity<?> getAllParts() {
        // Pobiera wszystkie części z repozytorium części, posortowane rosnąco po identyfikatorach
        var parts = partRepo.findAllByOrderByIdAsc();
        return ResponseEntity.ok(parts);
    }

    // Metoda obsługująca żądanie POST na ścieżce /api/service/{serviceId}/car-service
    @PostMapping("/{serviceId}/car-service")
    @PreAuthorize("hasRole('SERVICE') OR hasRole('ADMIN')")
    public ResponseEntity<?> assignCarServicesToService(@PathVariable Long serviceId, @RequestBody Long[] carServicesIds) {
        // Pobranie usługi na podstawie jej identyfikatora
        var serviceOpt = serviceRepo.findById(serviceId);
        if (serviceOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        var service = serviceOpt.get();
        var carServices = new HashSet<CarService>();

        // Pętla po identyfikatorach usług samochodowych które mają być przypisane do usługi
        for (var carServiceId : carServicesIds) {
            // Pobranie usługi samochodowej na podstawie jej identyfikatora
            var carServiceOpt = carServiceRepo.findById(carServiceId);
            if (carServiceOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            carServices.add(carServiceOpt.get()); // Dodanie usługi samochodowej do zbioru
        }

        service.getCarServices().addAll(carServices); // Dodanie zbioru usług samochodowych do usługi
        serviceRepo.save(service); // Zapisanie zmian w bazie danych
        return ResponseEntity.ok().build();
    }
}
