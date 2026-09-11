import { addFeed, createFeedFollow, getFeedsWithName, scrapeFeeds } from "src/lib/db/queries/feed"
import { User } from "src/lib/db/schema";

function parseDuration(durationStr: string): number {
    const regex = /^(\d+)(ms|s|m|h)$/;
    const match = durationStr.match(regex);
    if(match === null){
        throw new Error("match can't be null")
    }
    const [, value, unit] = match;
    const numValue = Number(value);
    switch(unit) {
        case "ms":
            return numValue;
        case "s":
            return numValue * 1000;
        case "m":
            return numValue * 60 * 1000;
        case "h":
            return numValue * 60 * 60 * 1000;
        default:
            throw new Error("Invalid time unit");
    }
}

export async function handlerFetchFeed(cmdName:string,time_between_reqs: string) : Promise<void> {
   
    const ms = parseDuration(time_between_reqs);
    console.log(`Collecting feeds every ${ms}`)
    scrapeFeeds().catch((err) => console.error(err))

    const interval = setInterval(() => {
    scrapeFeeds().catch((err) => console.error(err))
    }, ms);

await new Promise<void>((resolve) => {
  process.on("SIGINT", () => {
    console.log("Shutting down feed aggregator...");
    clearInterval(interval);
    resolve();
  });
});

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