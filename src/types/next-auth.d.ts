import { $Enums } from "@/lib/generated/prisma";
import NextAuth from "next-auth";
import { LoginProfile } from "./signIn.types";
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image?: string;
      forceLogout?: boolean;
      studentInfo: LoginProfile["student"];
      accesstoken: string;
      role: $Enums.UserRole;
    };
  }
  interface Account {
    id: string;
    name: string;
    email: string;
    image?: string;
  }
  interface User {
    id: string;
    name: string;
    email?: string;
    image?: string;
    forceLogout?: boolean;
    studentInfo: Omit<LoginProfile["student"],"firstNameEn", "lastNameEn">;
    accesstoken: string;
    role: $Enums.UserRole;
  }
  interface Profile {
    id: string;
    name: string;
    email: string;
    image?: string;
    given_name?: string | null;
    family_name?: string | null;
  }
}
declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    name: string;
    email: string;
    image?: string;
    forceLogout?: boolean;
    studentInfo: LoginProfile["student"];
    accesstoken: string;
    role: $Enums.UserRole;
  }
}
