import { readConfig } from "src/config";
import { addFeed, createFeedFollow, getFeedsWithName } from "src/lib/db/queries/feed"
import { getUserByName } from "src/lib/db/queries/users";
import { fetchFeed } from "src/rss";


export async function handlerFetchFeed(cmdName:string) : Promise<void> {
    const feed = await fetchFeed("https://www.wagslane.dev/index.xml")
    const result = JSON.stringify(feed, null, 2)    
    console.log(result);
};

export async function handlerInsertFeed(cmdName:string, ...args: string[]): Promise<void> {
   const config = readConfig();
   const user = await getUserByName(config.currentUserName);

    if (!user) {
  throw new Error(`User ${config.currentUserName} not found`);
}
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