package magazyn.projekt.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;


@Configuration
@EnableMethodSecurity
public class WebSecurityConfig{
    @Value("${projekt.corsOrigin}")
    private String origin;
    @Autowired
    UserDetailsServiceImpl userDetailsService;
    @Autowired
    private AuthEntryPointJwt unauthorizedHandler;

    // Bean do filtrowania tokenów JWT
    @Bean
    public AuthTokenFilter authenticationJwtTokenFilter() {
        return new AuthTokenFilter();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();

        authProvider.setUserDetailsService(userDetailsService); // Ustawienie serwisu do zarządzania użytkownikami
        authProvider.setPasswordEncoder(passwordEncoder()); // Ustawienie enkodera hasła

        return authProvider;
    }

    // Bean do zarządzania autoryzacją
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    // Bean do enkodowania hasła
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }


    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
                // Obsługa wyjątków
                .exceptionHandling(exception -> exception.authenticationEntryPoint(unauthorizedHandler))
                // wyłączenie sesji
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                // Autoryzacja requestów
                .authorizeHttpRequests(auth ->
                        auth
                                // Na te strony pozwalany jest request bez autoryzacji
                                .requestMatchers("/api/auth/login", "/api/auth/logout").permitAll()
                                // Na reszte endpointów jest wymagana autoryzajca
                                .anyRequest().authenticated()
                ).cors(corsConfigurer -> {
                    // Konfiguracja CORS
                    // Wstrzyknięcie klasy odpowiedzialnej za definicje corsa (np localhost 4200)
                    corsConfigurer.configurationSource(corsConfigurationSource());
                });

        // Wstrzykniecie filtrowania tokenów i auth providera
        http.authenticationProvider(authenticationProvider());
        http.addFilterBefore(authenticationJwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build(); // Zwrócenie skonfigurowanej SecurityFilterChain
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.addAllowedOrigin(origin); // Ustawienie dozwolonych źródeł origin
        configuration.addAllowedHeader("*"); // Ustawienie dozwolonych nagłówków
        configuration.addAllowedMethod("*"); // Ustawienie dozwolonych metod HTTP
        configuration.setAllowCredentials(true); // Zezwolenie na przesyłanie ciasteczek z uwierzytelnieniem


        // Jjest używany do definiowania konfiguracji CORS dla różnych URL w aplikacji Spring
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source; // Zwrócenie skonfigurowanego źródła konfiguracji CORS
    }
}
