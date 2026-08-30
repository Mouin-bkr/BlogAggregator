import { eq } from "drizzle-orm";
import { db } from "..";
import { users } from "../schema";

export async function createUser(name: string) {
  const [result] = await db.insert(users).values({ name: name }).returning();
  return result;
}

export async function getUserByName(name: string) {
    const [user] = await db.select().from(users).where(eq(users.name, name));
    return user;
}

export async function deleteUsers() {
  await db.delete(users).execute();
  return true;
}

export async function getUsers() {
    const result = await db.select().from(users);
    return result;
}