import "server-only";
import NextAuth, {
  User as UserDataRequired,
  type NextAuthOptions,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { app } from "@/lib/myku";
import { AxiosError } from "axios";
import { prisma } from "@/lib/db";
import { decodeJwt } from "jose";
import { collectAndSaveMyCourse } from "@/controllers/collectAndSaveMyCourse.controller";
import { User as UserTable } from "@/lib/generated/prisma";
import { referenceProcess, ReferenceType } from "./referenceName";
import { signInSchema } from "@/zod/auth";
import { envServer } from "@/env/server.mjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "Username",
          type: "text",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials) {
        try {
          const valid = signInSchema.safeParse(credentials);
          if (!valid.success) {
            throw new Error(valid.error.issues[0].message);
          }
          const res = await app.login({
            username: credentials!.username,
            password: credentials!.password,
          });
          if (res === null) {
            throw new Error("โปรดกรอกรหัสนิสิต/รหัสผ่าน");
          }
          if (res.data.user.student.campusCode !== "K") {
            throw new Error("เฉพาะนิสิตวิทยาเขตกำแพงแสน");
          }

          const { student } = res.data.user;
          const completeName = [
            student.firstNameTh,
            student.middleNameTh,
            student.lastNameTh,
          ]
            .filter(Boolean) // ตัดค่าว่าง/null/undefined ออก
            .join(" ");

          // --- START CHECKPOINT ON LOCAL SERVER
          const findUser = await prisma.user.findUnique({
            where: { stdCode: student.stdCode },
          });

          const referenceData: {
            type: ReferenceType;
            data: { code: string; nameTh: string };
          }[] = [
            {
              type: "campus",
              data: { code: student.campusCode, nameTh: student.campusNameTh },
            },
            {
              type: "department",
              data: {
                code: student.departmentCode,
                nameTh: student.departmentNameTh,
              },
            },
            {
              type: "faculty",
              data: {
                code: student.facultyCode,
                nameTh: student.facultyNameTh,
              },
            },
            {
              type: "major",
              data: { code: student.majorCode, nameTh: student.majorNameTh },
            },
          ];

          try {
            await referenceProcess(referenceData);
          } catch (refError) {
            console.error("Reference process error:", refError);
            throw refError;
          }

          const existingAdvisor = await prisma.advisor.findUnique({
            where: { advisorId: student.advisorId },
          });
          if (!existingAdvisor) {
            await prisma.advisor.create({
              data: {
                advisorId: student.advisorId,
                advisorNameTh: student.advisorNameTh,
                positionTh: student.positionTh,
              },
            });
          }

          const basicInfo: Omit<
            UserTable,
            "loggedCount" | "requestUpdateAt" | "createdAt"
          > = {
            stdCode: student.stdCode,
            loginName: student.loginName,
            name: completeName,
            stdId: student.stdId,
            titleTh: student.titleTh,
            firstNameTh: student.firstNameTh,
            middleNameTh: student.middleNameTh,
            lastNameTh: student.lastNameTh,
            copenId: student.copenId,
            campusCode: student.campusCode,
            facultyCode: student.facultyCode,
            departmentCode: student.departmentCode,
            majorCode: student.majorCode,
            nationCode: student.nationCode,
            studentStatusCode: student.studentStatusCode,
            studentTypeCode: student.studentTypeCode,
            edulevelCode: student.edulevelCode,
            studentYear: student.studentYear,
            advisorId: student.advisorId,
            email: student.email.trim() || null,
            mobileNo: student.mobileNo.trim() || null,
          };
          if (!findUser) {
            await prisma.user.create({
              data: basicInfo,
            });
          }
          // --- END CHECKPOINT ON LOCAL SERVER

          // คืน user object
          const user: UserDataRequired = {
            id: res.data.user.idCode,
            name: completeName,
            studentInfo: student,
            accesstoken: res.data.accesstoken,
          };
          return user;
        } catch (error) {
          if (error instanceof AxiosError) {
            const r = error.response?.data as {
              code: string;
              message: string;
              user: null;
            };
            throw new Error("รหัสนิสิต/รหัสผ่านไม่ถูกต้อง");
          }

          if (error instanceof Error) {
            throw new Error(error.message);
          }

          console.error("Maybe unknown error:", error);
          throw new Error("เกิดข้อผิดพลาดไม่ทราบสาเหตุ");
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/error",
  },
  callbacks: {
    jwt: async ({ token, account, user }) => {
      if (account && account.userId) {
        token.id = account.userId;
      }
      if (user) {
        token.studentInfo = user.studentInfo;
        token.accesstoken = user.accesstoken;
      }
      return token;
    },
    session: async ({ session, token }) => {
      session.user.id = token.id;
      session.user.studentInfo = token.studentInfo;
      session.user.accesstoken = token.accesstoken;
      session.user.accesstoken = token.accesstoken;
      return session;
    },
  },
  events: {
    updateUser({ user }) {},
    async signIn({ user }) {
      await prisma.user.update({
        where: { stdCode: user.studentInfo.stdCode },
        data: { loggedCount: { increment: 1 } },
      });
      const registeredCourse = await prisma.registeredCourse.count({
        where: { stdCode: user.studentInfo.stdCode },
      });
      if (registeredCourse === 0) {
        try {
          await collectAndSaveMyCourse(
            user.studentInfo.stdCode,
            user.accesstoken
          );
        } catch (error) {
          console.error("Error collecting and saving courses:", error);
        }
      }
    },
    async signOut({ session, token }) {
      app.logout(token.studentInfo.loginName, token.accesstoken);
    },
    session({ session, token }) {
      if (
        envServer.NODE_ENV === "production" &&
        Math.floor(Date.now() / 1000) > Number(decodeJwt(token.accesstoken).exp)
      ) {
        session.user.forceLogout = true;
      }
    },
  },
};

export default NextAuth(authOptions);
