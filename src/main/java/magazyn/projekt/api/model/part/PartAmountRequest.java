package magazyn.projekt.api.model.part;

import lombok.Builder;

@Builder(toBuilder = true)
public class PartAmountRequest {
    public Long partId;
    public Integer amount;
}
