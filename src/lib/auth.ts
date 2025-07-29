import "server-only";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getServerSession } from "next-auth";
import { decodeJwt } from "jose";
import { MyKuUserTokenInterface } from "../types/signIn.types";

export async function Auth(noCondition: boolean = false) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.forceLogout) return null
  return session;
}

export function decodeAccessToken(token: string) {
  return decodeJwt(token) as MyKuUserTokenInterface;
}
