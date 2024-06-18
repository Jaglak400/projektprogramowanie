package magazyn.projekt.api.controllers;

import magazyn.projekt.api.model.business.PartService;
import magazyn.projekt.api.model.part.Part;
import magazyn.projekt.api.model.part.PartRequest;
import magazyn.projekt.api.repos.PartRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

// Wszystkie ścieżki w tej klasie zaczynają się od /api/part
@RestController
@RequestMapping("/api/part")
public class PartController {
    // @Autowired automatycznie wstrzykują sie do klasy UserController
    @Autowired
    PartService partService;
    @Autowired
    private PartRepo partRepo;

    // Metoda obsługująca żądanie GET na ścieżce /api/part/{id}
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('WAREHOUSE') or hasRole('SERVICE') or hasRole('ADMIN')")
    public ResponseEntity<?> getPart(@PathVariable("id") Long id){
        return ResponseEntity.ok(partRepo.findById(id));
    }

    // Metoda obsługująca żądanie GET na ścieżce /api/part
    @GetMapping
    @PreAuthorize("hasRole('WAREHOUSE') or hasRole('SERVICE') or hasRole('ADMIN')")
    public ResponseEntity<List<Part>> getAllParts(){
        return ResponseEntity.ok(partService.getAllParts());
    }

    // Metoda obsługująca żądanie POST na ścieżce /api/part/new
    @PostMapping("/new")
    @PreAuthorize("hasRole('WAREHOUSE') or hasRole('ADMIN')")
    public ResponseEntity<?> addNewPart(
           @RequestBody PartRequest partRequest
    ){
        // Tworzenie nowej części na podstawie danych przekazanych w zapytaniu
        var part = Part.builder()
                .name(partRequest.name)
                .inStock(partRequest.amount)
                .price(new BigDecimal(partRequest.price))
                .build();
        part = partService.addPart(part);
        return ResponseEntity.ok(part);
    }

    // Metoda obsługująca żądanie POST na ścieżce /api/part/add
    @PostMapping("/add")
    @PreAuthorize("hasRole('WAREHOUSE') or hasRole('ADMIN')")
    public ResponseEntity<?> addPart(@RequestParam("name") String partName, @RequestParam("amount") Integer amount){
        var part = partService.getPartByName(partName);
        if(part.isEmpty()){
            return ResponseEntity.notFound().build();
        }
        // Zwiększenie ilości na magazynie o wartość przekazaną w parametrze amount
        part.get().setInStock(part.get().getInStock() + amount);
        partService.addPart(part.get());

        return ResponseEntity.ok().build();
    }

    // Metoda obsługująca żądanie POST na ścieżce /api/part/withdraw
    @PostMapping("/withdraw")
    @PreAuthorize("hasRole('SERVICE') or hasRole('ADMIN')")
    public ResponseEntity<?> withdrawPart(@RequestParam("name") String partName, @RequestParam("amount") Integer amount) {
        // Pobranie części z serwisu na podstawie nazwy
        var part = partService.getPartByName(partName);
        if (part.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        // Sprawdzenie czy w magazynie jest wystarczająca ilość części do wyjęcia
        var howManyParts = part.get().getInStock();
        if (howManyParts < amount) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Not enough parts in stock");
        }

        // Zmiejszenie ilości na magazynie o wartość przekazaną w parametrze amount
        part.get().setInStock(part.get().getInStock() - amount);
        partService.addPart(part.get());

        return ResponseEntity.ok(amount);
    }

    // Metoda obsługująca żądanie DELETE na ścieżce /api/part/{id}
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('WAREHOUSE') or hasRole('ADMIN')")
    public ResponseEntity<?> deletePartById(@PathVariable Long id) {
        Optional<Part> part = partService.getPartById(id);
        if (part.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        partService.deletePartById(id);
        return ResponseEntity.ok().build();
    }

    // Metoda obsługująca żądanie PUT na ścieżce /api/part/{id}
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('WAREHOUSE') or hasRole('ADMIN')")
    public ResponseEntity<?> updatePart(@PathVariable Long id, @RequestBody PartRequest partRequest) {
        Optional<Part> partOptional = partService.getPartById(id);
        if (partOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        // Pobieranie części
        Part part = partOptional.get();
        // Aktualizuje informacje o części na podstawie danych przekazanych w żądaniu
        part.setName(partRequest.name);
        part.setInStock(partRequest.amount);
        part.setPrice(new BigDecimal(partRequest.price));

        part = partService.addPart(part);
        return ResponseEntity.ok(part);
    }

    @PutMapping("/documents")
    public ResponseEntity<?> setPartDocuments(@RequestParam("part") Long partId,
                                              @RequestBody Boolean[] documents){
        if(documents.length != 3)
            return ResponseEntity.badRequest().build();
        var partOpt = partRepo.findById(partId);
        if(partOpt.isEmpty()){
            return ResponseEntity.notFound().build();
        }
        var part = partOpt.get();

        part = partRepo.save(part.toBuilder()
                .zl(documents[0])
                .ww(documents[1])
                .wz(documents[2])
                .build()
        );
        return ResponseEntity.ok(part);
    }
}
