package magazyn.projekt.api.model;

import jakarta.persistence.*;
import lombok.*;
import magazyn.projekt.api.model.user.User;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder(toBuilder = true)
public class Visit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    @ManyToOne
    User client;
    LocalDate date;
}
