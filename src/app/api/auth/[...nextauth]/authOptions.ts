import "server-only";
import NextAuth, {
  User as UserDataRequired,
  type NextAuthOptions,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { app } from "@/lib/myku";
import { AxiosError } from "axios";
import { prisma } from "@/lib/db";
// import { decodeJwt } from "jose";
import { revalidateMyCourse } from "@/controllers/revalidateMyCourse.controller";
import { User as UserTable } from "@/lib/generated/prisma";
import { referenceProcess, ReferenceType } from "./referenceName";
import { signInSchema } from "@/zod/auth";
import { envServer } from "@/env/server.mjs";
import LogModel, { LogAction, LoginDetail } from "@/mongoose/model/Log";
import mongoConnect from "@/mongoose/connect";
import { createSession, revokeSession, validateSession } from "@/lib/session";

mongoConnect();

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
            username: valid.data.username,
            password: valid.data.password,
          });
          if (!res) {
            throw new Error("โปรดกรอกรหัสนิสิต/รหัสผ่าน");
          }
          if (res.data.user.student.campusCode !== "K") {
            await LogModel.create({
              stdCode: res.data.user.student.stdCode,
              action: LogAction.LOGIN,
              success: false,
              detail: LoginDetail.เฉพาะนิสิตเท่านั้น,
            });
            throw new Error("เฉพาะนิสิตวิทยาเขตกำแพงแสน");
          }
          if (res.data.user.userType !== "1") {
            await LogModel.create({
              stdCode: res.data.user.student.stdCode,
              action: LogAction.LOGIN,
              success: false,
              detail: LoginDetail.เฉพาะนิสิตเท่านั้น,
            });
            throw new Error("เฉพาะนิสิตเท่านั้น (กลัวระบบพังจัฟ 😢)");
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
            "loggedCount" | "requestUpdateAt" | "createdAt" | "role"
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
          const sessionId = await createSession(res.data.user.student.stdCode);
          const user: UserDataRequired = {
            id: res.data.user.student.stdCode,
            name: completeName,
            studentInfo: {
              ...basicInfo,
              email: undefined,
              mobileNo: undefined,
              facultyCode: undefined,
              majorCode: undefined,
              departmentCode: undefined,
              majorNameTh: student.majorNameTh,
              facultyNameTh: student.facultyNameTh,
              studentStatusNameTh: student.studentStatusNameTh,
            },
            accesstoken: res.data.accesstoken,
            role: findUser?.role || "STUDENT",
            sessionId,
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
      if (user) {
        token.id = user.id;
        token.studentInfo = user.studentInfo;
        token.accesstoken = user.accesstoken;
        token.sessionId = user.sessionId;
      }
      return token;
    },
    session: async ({ session, token }) => {
      session.user.id = token.id;
      session.user.studentInfo = token.studentInfo;
      session.user.accesstoken = token.accesstoken;
      session.user.sessionId = token.sessionId;
      return session;
    },
  },
  events: {
    async signIn({ user }) {
      try {
        const registeredCourse = await prisma.registeredCourse.count({
          where: { stdCode: user.id },
        });
        if (registeredCourse === 0) {
          try {
            await revalidateMyCourse(user.id, user.accesstoken);
          } catch (error) {
            console.error("Error collecting and saving courses:", error);
          }
        }
      } catch (error) {
        console.error("Error in signIn event:", error);
      }
    },
    async signOut({ token }) {
      try {
        const isValidate = await validateSession(token.id, token.sessionId);
        if (isValidate) {
          await revokeSession(token.id, token.sessionId);
          return;
        }
        const isSessionNotDelete = await prisma.session.findUnique({
          where: {
            id: token.sessionId,
            stdCode: token.id,
            revokedAt: null,
          },
        });
        if (isSessionNotDelete) {
          await prisma.session.update({
            where: {
              id: token.sessionId,
              stdCode: token.id,
              revokedAt: null,
            },
            data: { revokedAt: new Date() },
          });
        }

        await LogModel.create({
          stdCode: token.id,
          action: LogAction.LOGOUT,
        });
        app.logout(token.studentInfo.loginName, token.sessionId);
      } catch (error) {
        console.error("Error in signOut event:", error);
      }
    },
    async session({ session }) {
      try {
        const { id: userId, sessionId, forceLogout } = session.user;
        const isActive = await validateSession(userId, sessionId);
        if (!isActive && !forceLogout) {
          session.user.forceLogout = true;
          // token can't re-assign here
        }
        // if (
        //   envServer.NODE_ENV === "production" &&
        //   Math.floor(Date.now() / 1000) >
        //     Number(decodeJwt(token.sessionId).exp)
        // ) {
        //   session.user.forceLogout = true;
        // }
      } catch (error) {
        console.error("Error in session event:", error);
      }
    },
  },
};

export default NextAuth(authOptions);
