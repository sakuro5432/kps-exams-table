"use server";
import { Auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { UserExamNote } from "@/lib/generated/prisma";

export async function getNote(
  userExamId: string
): Promise<UserExamNote | null> {
  const isAuth = await Auth();
  if (!isAuth) {
    throw new Error("Unauthorized access");
  }
  if (!userExamId) {
    throw new Error("Missing userExamId");
  }
  const note = await prisma.userExamNote.findUnique({
    where: { userExamId, deletedAt: null },
  });
  return note;
}
