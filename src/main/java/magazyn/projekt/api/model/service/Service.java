package magazyn.projekt.api.model.service;

import jakarta.persistence.*;
import lombok.*;
import magazyn.projekt.api.model.car_services.CarService;
import magazyn.projekt.api.model.part.Part;
import magazyn.projekt.api.model.part.ServicePart;
import magazyn.projekt.api.model.user.User;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "services")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Service {
    public enum Status{
        UNDERTAKING, REJECTED, COMPLETED;
        public static Status convert(byte value) {
            return Status.values()[value];
        }
    }
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    String description;
    @ManyToOne(cascade = CascadeType.DETACH)
    @JoinColumn(name="service_man_id", nullable=true)
    User serviceMan;
    @ManyToOne(cascade = CascadeType.DETACH)
    @JoinColumn(name="client_id", nullable=false)
    User client;
    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    Status status;
    @ManyToMany(fetch = FetchType.LAZY, cascade = CascadeType.DETACH)
    @JoinTable(name = "serviceParts_parts",
            joinColumns = @JoinColumn(name = "service_id"),
            inverseJoinColumns = @JoinColumn(name = "servicePart_id"))
    Set<ServicePart> serviceParts = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY, cascade = CascadeType.DETACH)
    @JoinTable(name = "service_carService",
            joinColumns = @JoinColumn(name = "service_id"),
            inverseJoinColumns = @JoinColumn(name = "carService_id"))
    Set<CarService> carServices = new HashSet<>();
}
