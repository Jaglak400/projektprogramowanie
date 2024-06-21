import { UserResponse } from "./user-response";

export interface VisitResponse{
    id: number;
    date: Date;
    client: UserResponse;
}