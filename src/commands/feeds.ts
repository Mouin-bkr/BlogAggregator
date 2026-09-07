import { addFeed, createFeedFollow, getFeedsWithName } from "src/lib/db/queries/feed"
import { fetchFeed } from "src/rss";
import { User } from "src/lib/db/schema";


export async function handlerFetchFeed(cmdName:string) : Promise<void> {
    const feed = await fetchFeed("https://www.wagslane.dev/index.xml")
    const result = JSON.stringify(feed, null, 2)
    console.log(result);
};

export async function handlerInsertFeed(cmdName:string, user: User, ...args: string[]): Promise<void> {
    if(args.length !== 2) {
        throw new Error("missing args")
    }

    const feed = await addFeed(args[0], args[1], user.id);
    if (!feed) {
        throw new Error("Failed to create feed");
    }

    const feedFollow = await createFeedFollow(feed.id, user.id);
    console.log(`feed name : ${feedFollow.feedName}\nuser name : ${feedFollow.userName}`);
};

export async function handlerShowAllFeeds(cmdName:string): Promise<void>{
    const result =await getFeedsWithName() 
    for( const res of result){
        console.log(`feed name : ${res.feedName}\nfeed url : ${res.feedUrl}\nuser name : ${res.userName}`)
    }
}