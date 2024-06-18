import { CarServiceResponse } from "../carService/car-service-response";
import { ServicePartResponse } from "../part/service-part-response";
import { UserResponse } from "../user-response";

export interface ServiceResponse{
    id: number;
    description: string;
    status: string;
    serviceParts: ServicePartResponse[];
    carServices: CarServiceResponse[];
    client: UserResponse;
    serviceMan: UserResponse;
    editingStatus?: boolean;
    editing?: boolean;
    zm: boolean;
}
