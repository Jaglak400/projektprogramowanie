package magazyn.projekt.config;

import magazyn.projekt.api.model.Role;
import magazyn.projekt.api.model.user.User;
import magazyn.projekt.api.repos.RoleRepo;
import magazyn.projekt.api.repos.UserRepo;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.Set;

@Component
public class DataLoader {
    // Tworzenie ról dla użytkownikóww roleRepo
    public DataLoader(RoleRepo roleRepo, UserRepo userRepo){
        if(roleRepo.findAll().isEmpty()){
            roleRepo.saveAll(Arrays.asList(
                    Role.builder().name(Role.Type.ROLE_WAREHOUSE).build(),
                    Role.builder().name(Role.Type.ROLE_SERVICE).build(),
                    Role.builder().name(Role.Type.ROLE_CLIENT).build(),
                    Role.builder().name(Role.Type.ROLE_ADMIN).build()
            ));
        }
        if(userRepo.findAll().isEmpty()){
            userRepo.save(
                    User.builder()
                            .name("T")
                            .surname("Y")
                            .username("test")
                            .password("$2a$10$a//Gt5OZKm.31ZLV17DAQu6jtMTH2UrBD0RmBNbhMY6DbZESjlWgi")
                            .roles(Set.of(roleRepo.findByName(Role.Type.ROLE_ADMIN)))
                            .build()
            );
        }
    }
}
