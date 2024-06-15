package magazyn.projekt.api.model;

import jakarta.persistence.*;
import lombok.*;
import magazyn.projekt.api.model.service.Service;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder(toBuilder = true)
public class Complaint {
    public enum Status {
        ACCEPTED,
        DENIED,
        ONGOING
    }
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    String description;
    @ManyToOne
    Service service;
    Status status;
}
