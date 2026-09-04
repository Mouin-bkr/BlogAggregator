import { eq } from "drizzle-orm";
import { db } from "..";
import { feeds, users } from "../schema";

export async function addFeed(name:string, url:string, userId:string){
  const [result] = await db.insert(feeds).values({name,url,userId}).returning();
  return result ;
}
export async function getFeedsWithName() {
  const result = await db.select({
    feedName:feeds.name,
    feedUrl:feeds.url,
    userName: users.name})
    .from(feeds)
    .innerJoin(users,eq(feeds.userId,users.id));

  return result
}