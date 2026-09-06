import { eq } from "drizzle-orm";
import { db } from "..";
import { feedFollows, feeds, users } from "../schema";

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

export async function getFeedByUrl(url: string) {
  const [feed] = await db.select().from(feeds).where(eq(feeds.url, url));
  return feed;
}

export async function createFeedFollow(feedId: string , userId: string){
  const [newFeedFollow] = await db.insert(feedFollows).values({feedId,userId}).returning();

  const [result] = await db.select(
    {id: feedFollows.id,
    createdAt: feedFollows.createdAt,
    updatedAt: feedFollows.updatedAt,
    userId: feedFollows.userId,
    feedId: feedFollows.feedId,
    feedName: feeds.name,
    userName: users.name
    })
    .from(feedFollows)
    .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
    .innerJoin(users, eq(feedFollows.userId, users.id))
    .where(eq(feedFollows.id, newFeedFollow.id));

    return result;
}

export async function getFeedFollowsForUser(userId : string){
  const result = await db.select(
    {id: feedFollows.id,
    createdAt: feedFollows.createdAt,
    updatedAt: feedFollows.updatedAt,
    feedName: feeds.name,
    userName: users.name
    })
    .from(feedFollows)
    .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
    .innerJoin(users, eq(feedFollows.userId, users.id))
    .where(eq(feedFollows.userId, userId));

    return result;
}