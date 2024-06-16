package magazyn.projekt.config;

import com.fasterxml.jackson.annotation.JsonIgnore;
import magazyn.projekt.api.model.user.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

public class UserDetailsImpl implements UserDetails {
    private static final long serialVersionUID = 1L;

    private Long id;
    private String username;
    @JsonIgnore
    private String password;

    // Wymaga interfejs user details
    private Collection<? extends GrantedAuthority> authorities;

    // Konstruktor
    public UserDetailsImpl(Long id, String username, String password,
                           Collection<? extends GrantedAuthority> authorities) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.authorities = authorities;
    }

    // Konwersja własnej klasy użytkownika na wymagana przez spring security
    public static UserDetailsImpl build(User user) {
        // Mapowanie ról użytkownika na Spring GrantedAuthority
        List<GrantedAuthority> authorities = user.getRoles().stream()
                // Dla każdej roli w strumieniu mapuje nazwę roli na obiekt SimpleGrantedAuthority który jest typem Spring Security reprezentującym uprawnienie
                .map(role -> new SimpleGrantedAuthority(role.getName().name()))
                // zbiera zmapowane obiekty SimpleGrantedAuthority do listy
                .collect(Collectors.toList());

        // Zwracanie obiektu UserDetailsImpl z danymi użytkownika
        return new UserDetailsImpl(
                user.getId(),
                user.getUsername(),
                user.getPassword(),
                authorities);
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    public Long getId() {
        return id;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    // Metoda która porównuje dwa obiekty UserDetailsImpl na podstawie ich ID użytkownika.
    @Override
    public boolean equals(Object o) {
        // Jeśli referencje są identyczne obiekty są równe
        if (this == o)
            return true;
        // Jeśli obiekt porównywany jest null lub nie jest instancją UserDetailsImpl obiekty nie są równe
        if (o == null || getClass() != o.getClass())
            return false;
        // Konwersja obiektu do typu UserDetailsImpl
        UserDetailsImpl user = (UserDetailsImpl) o;
        // Porównanie ID użytkownika obecnego obiektu UserDetailsImpl z ID użytkownika drugiego obiektu UserDetailsImpl
        return Objects.equals(id, user.id);
    }
}

