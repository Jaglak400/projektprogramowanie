package magazyn.projekt.api.serializers;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;
import magazyn.projekt.api.model.user.User;

import java.io.IOException;

//UserSerializer dziedziczy z StdSerializer<User> i definiuje sposób serializacji obiektu User do JSON
public class UserSerializer extends StdSerializer<User> {
    public UserSerializer() {
        this(null);
    }
    protected UserSerializer(Class<User> t) {
        super(t);
    }

    //Definiowanie sposobu serializacji obiektu User do formatu JSON
    @Override
    public void serialize(User user, JsonGenerator jgen, SerializerProvider serializerProvider) throws IOException {
        jgen.writeStartObject();
            jgen.writeNumberField("id", user.getId());
            jgen.writeStringField("username", user.getUsername());
        jgen.writeStringField("name", user.getName());
        jgen.writeStringField("surname", user.getSurname());
        jgen.writeObjectField("roles", user.getRoles());

        jgen.writeArrayFieldStart("clientServices");
            for(var clientService : user.getClientServices()){
                jgen.writeStartObject();
                    jgen.writeNumberField("id", clientService.getId());
                    jgen.writeStringField("description", clientService.getDescription());
                jgen.writeStringField("status", clientService.getStatus().toString());
                jgen.writeEndObject();
            }
        jgen.writeEndArray();

        jgen.writeEndObject();
    }
}
