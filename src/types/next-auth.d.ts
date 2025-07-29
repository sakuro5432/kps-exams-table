// import { $Enums } from "@/lib/generated/prisma";
// import NextAuth from "next-auth";
// import { MyKuLoginProfile } from "./sign-in";
// declare module "next-auth" {
//   interface Session {
//     user: {
//       id: string;
//       name: string;
//       email: string;
//       image?: string;
//       campusNameTh: string;
//       facultyNameTh: string;
//       departmentNameTh: string;
//       majorNameTh: string;
//       studentStatusNameTh: string;
//       studentYear: string;
//       accesstoken: string;
//       renewtoken: string;
//       forceLogout?: boolean;
//     };
//   }
//   interface Account {
//     id: string;
//     name: string;
//     email: string;
//     image?: string;
//   }
//   interface User {
//     id: string;
//     name: string;
//     email?: string;
//     image?: string;
//     campusNameTh: string;
//     facultyNameTh: string;
//     departmentNameTh: string;
//     majorNameTh: string;
//     studentStatusNameTh: string;
//     studentYear: string;
//     accesstoken: string;
//     renewtoken: string;
//     forceLogout?: boolean;
//   }
//   interface Profile {
//     id: string;
//     name: string;
//     email: string;
//     image?: string;
//     given_name?: string | null;
//     family_name?: string | null;
//   }
// }
// declare module "next-auth/jwt" {
//   interface JWT {
//     id: string;
//     name: string;
//     email: string;
//     image?: string;
//     campusNameTh: string;
//     facultyNameTh: string;
//     departmentNameTh: string;
//     majorNameTh: string;
//     studentStatusNameTh: string;
//     studentYear: string;
//     accesstoken: string;
//     renewtoken: string;
//     forceLogout?: boolean;
//   }
// }
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
    studentInfo: LoginProfile["student"];
    accesstoken: string;
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
  }
}
