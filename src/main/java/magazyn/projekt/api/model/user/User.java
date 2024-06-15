package magazyn.projekt.api.model.user;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import jakarta.persistence.*;
import lombok.*;
import magazyn.projekt.api.model.Role;
import magazyn.projekt.api.model.service.Service;
import magazyn.projekt.api.serializers.UserSerializer;

import java.util.HashSet;
import java.util.Set;


@Getter
@Setter
@Builder
@Entity
@NoArgsConstructor
@AllArgsConstructor
@JsonSerialize(using = UserSerializer.class)
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    @Column(unique = true)
    String username;
    @JsonIgnore
    String password;
    String name;
    String surname;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<Role> roles = new HashSet<>();  // Inicjalizacja jako pusty zestaw

    @OneToMany(mappedBy="client", cascade = CascadeType.REMOVE)
    Set<Service> clientServices  = new HashSet<>();

    @OneToMany(mappedBy="serviceMan", cascade = CascadeType.REMOVE)
    Set<Service> serviceManServices  = new HashSet<>();
}