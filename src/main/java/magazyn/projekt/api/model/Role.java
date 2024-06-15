package magazyn.projekt.api.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Role {
    public enum Type {
        ROLE_WAREHOUSE,
        ROLE_SERVICE,
        ROLE_CLIENT,
        ROLE_ADMIN
    }
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    Type name;

    //konstruktor który umożliwia tworzenie obiektu Role z określonym typem roli
    public Role(Role.Type role){
        this.name = role;
    }
}
