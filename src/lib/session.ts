import "server-only";
import { prisma } from "@/lib/db";
import { redis } from "@/lib/redis";
import { addHours } from "date-fns";
import LogModel, { LogAction } from "@/mongoose/model/Log";

// helper function
export function getSessionKey(stdCode: string) {
  return `s:${stdCode}`;
}

// query function
async function getSession(stdCode: string) {
  return await redis.get(getSessionKey(stdCode));
}

// create session
export async function createSession(stdCode: string, ttlHours = 2) {
  const session = await getSession(stdCode);
  if (session) {
    await revokeSession(stdCode, session);
  }
  const [_, { id: sessionId }] = await prisma.$transaction([
    prisma.user.update({
      where: { stdCode },
      data: { loggedCount: { increment: 1 } },
    }),
    prisma.session.create({
      data: { stdCode, expiredAt: addHours(new Date(), ttlHours) },
    }),
  ]);
  await redis.set(getSessionKey(stdCode), sessionId, "EX", ttlHours * 3600);
  await LogModel.create({
    stdCode,
    action: LogAction.LOGIN,
    success: true,
  });
  return sessionId;
}

// revoke session
export async function revokeSession(stdCode: string, sessionId: string) {
  await redis.del(getSessionKey(stdCode));
  await prisma.session.update({
    where: { id: sessionId, stdCode, revokedAt: null },
    data: { revokedAt: new Date() },
  });
  await LogModel.create({
    stdCode,
    action: LogAction.LOGOUT,
  });
}

// validate session
export async function validateSession(stdCode: string, sessionId: string) {
  const getSessionId = await getSession(stdCode);
  if (getSessionId) {
    // checking that current session from client is equal in redis or not
    return getSessionId === sessionId;
  }
  return false;
}
