import { RoleResponse } from "./role.response";

export interface UserResponse{
    id: number;
    username: string;
    name: string;
    surname: string;
    roles: RoleResponse[];
}