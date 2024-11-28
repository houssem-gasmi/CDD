import { CddUser } from "../../../models/CddUser.js";
import { Role } from "../../../types/types.js";

export interface LoginResponseDto {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: Role;
}
