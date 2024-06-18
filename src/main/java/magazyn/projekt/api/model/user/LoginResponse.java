package magazyn.projekt.api.model.user;

import lombok.AllArgsConstructor;
import magazyn.projekt.api.model.Role;

import java.util.Set;

@AllArgsConstructor
public class LoginResponse {
    public Long id;
    public String username;
    public Set<Role> roles;
}
