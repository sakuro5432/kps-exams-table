import "server-only";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getServerSession } from "next-auth";
import { decodeJwt } from "jose";
import { MyKuUserTokenInterface } from "../types/signIn.types";
import { validateSession } from "./session";

export async function Auth() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.forceLogout) return null;

  // const data = await prisma.user.findUnique({
  //   where: { stdCode: session?.user.studentInfo.stdCode },
  //   select: { stdCode: true, stdId: true, role: true },
  // });
  // if (!data) return null;

  const isValidSession = await validateSession(
    session.user.id,
    session.user.sessionId
  );
  if (!isValidSession) {
    return null;
  }
  return { session: session.user };
}

export function decodeAccessToken(token: string) {
  return decodeJwt(token) as MyKuUserTokenInterface;
}
