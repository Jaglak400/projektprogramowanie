package magazyn.projekt.api.model.business;

import magazyn.projekt.api.model.part.Part;
import magazyn.projekt.api.repos.PartRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@Service
public class PartService {
    // @Autowired automatycznie wstrzykuje zależność PartRepo do klasy PartService
    @Autowired
    PartRepo partRepo;

    public Optional<Part> getPartByName(String name) {
        // Przetwarza nazwę części przed przekazaniem do repozytorium part
        return partRepo.findPartByName(name.toLowerCase().trim());
    }

    public Part addPart(Part part) {
        return partRepo.save(part);
    }

    public List<Part> getAllParts() {
        return partRepo.findAll();
    }

    public void deletePartById(Long id) {
        partRepo.deleteById(id);
    }

    // Metoda zwracająca opcjonalny obiekt Part na podstawie identyfikatora
    public Optional<Part> getPartById(Long id) {
        return partRepo.findById(id);
    }
}
