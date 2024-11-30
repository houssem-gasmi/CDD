import { Role } from "../../../types/types.js";

// DTO for Login Response
export interface LoginResponseDto {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: Role;
}
