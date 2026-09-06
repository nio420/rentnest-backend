import { Role } from "../../../generated/prisma/enums";

export interface IRegisterUser {
  name: string;
  email: string;
  password: string;
  profilePhoto?: string;
  role: Role;
}

export interface IloginUser {
  email: string;
  password: string;
}

export interface IGoogleUser {
  name: string;
  email: string;
  profilePhoto?: string;
}
