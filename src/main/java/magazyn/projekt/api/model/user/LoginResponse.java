package magazyn.projekt.api.model.user;

import lombok.AllArgsConstructor;

import java.util.List;

@AllArgsConstructor
public class LoginResponse {
    public Long id;
    public String username;
    public List<String> roles;
}
