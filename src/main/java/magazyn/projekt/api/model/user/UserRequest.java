package magazyn.projekt.api.model.user;

import lombok.*;

import java.util.Set;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserRequest {
    String username;
    String password;
    String name;
    String surname;
    Set<String> roles;
}
