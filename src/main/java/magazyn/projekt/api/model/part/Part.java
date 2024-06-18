package magazyn.projekt.api.model.part;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "parts")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder(toBuilder = true)
public class Part {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    String name;
    Integer inStock = 0;
    BigDecimal price;
    @Column(columnDefinition = "boolean default false")
    boolean zl = false;
    @Column(columnDefinition = "boolean default false")
    boolean ww = false;
    @Column(columnDefinition = "boolean default false")
    boolean wz = false;
}