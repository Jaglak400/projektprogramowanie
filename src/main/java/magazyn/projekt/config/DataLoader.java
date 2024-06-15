package magazyn.projekt.config;

import magazyn.projekt.api.model.Role;
import magazyn.projekt.api.repos.RoleRepo;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
public class DataLoader {
    public DataLoader(RoleRepo roleRepo){
        if(roleRepo.findAll().isEmpty()){
            roleRepo.saveAll(Arrays.asList(
                    Role.builder().name(Role.Type.ROLE_WAREHOUSE).build(),
                    Role.builder().name(Role.Type.ROLE_SERVICE).build(),
                    Role.builder().name(Role.Type.ROLE_CLIENT).build(),
                    Role.builder().name(Role.Type.ROLE_ADMIN).build()
            ));
        }
    }
}
