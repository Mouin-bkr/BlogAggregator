import { and, asc, eq, sql } from "drizzle-orm";
import { db } from "..";
import { feedFollows, feeds, posts, users } from "../schema";
import { fetchFeed, parsePubDate, RSSItem } from "src/rss";

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
};

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

export async function deleteFeedFollow(feedId: string , userId: string){
const result = await db.delete(feedFollows)
.where( and (
  eq(feedFollows.userId ,userId),
  eq(feedFollows.feedId ,feedId))
);
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

export async function markFeedFetched (feedId: string){
  const result = await db.update(feeds)
  .set({last_fetched_at: new Date(),
         updatedAt: new Date() })
  .where(eq(feeds.id, feedId)).returning();
  return result;
};

export async function getNextFeedToFetch(){
  const [result] = await db.select().from(feeds).orderBy(sql`${feeds.last_fetched_at} asc nulls first`).limit(1);  
  return result;

};

export async function scrapeFeeds(){
  const feed = await getNextFeedToFetch() ;
  if (!feed){
    throw new Error("feed not found");
  }
  console.log(`feed found and fetching: ${feed.name}`)
  const rss = await fetchFeed(feed.url)
  await markFeedFetched(feed.id)

  for (const rssItem of rss.channel.item){
    await createPostFromItem(rssItem, feed.id);
  }
};

async function createPostFromItem(item: RSSItem, feedId: string){
  try {
    await createPost({
      title: item.title,
      url: item.link,
      description: item.description,
      publishedAt: parsePubDate(item.pubDate),
      feedId,
    });
  } catch (err) {
    console.error(`couldn't save post "${item.title}": ${(err as Error).message}`);
  }
}

export async function createPost(post: typeof posts.$inferInsert){
  const [result] = await db.insert(posts).values(post).onConflictDoNothing().returning();
  return result;
}

export async function getPostsForUser(userId: string, limit: number){
  const result = await db.select({
    id: posts.id,
    createdAt: posts.createdAt,
    updatedAt: posts.updatedAt,
    title: posts.title,
    url: posts.url,
    description: posts.description,
    publishedAt: posts.publishedAt,
    feedId: posts.feedId,
    feedName: feeds.name,
  })
    .from(posts)
    .innerJoin(feeds, eq(posts.feedId, feeds.id))
    .innerJoin(feedFollows, eq(feedFollows.feedId, feeds.id))
    .where(eq(feedFollows.userId, userId))
    .orderBy(sql`${posts.publishedAt} desc nulls last`)
    .limit(limit);
  return result;
}
