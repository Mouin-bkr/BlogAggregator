import { createFeedFollow, deleteFeedFollow, getFeedByUrl, getFeedFollowsForUser } from "src/lib/db/queries/feed";
import { User } from "src/lib/db/schema";


export async function handlerFollow(cmdName:string, user: User, url:string): Promise<void>{
    if (!url) {
        throw new Error("URL is required for follow command");
    }

    const feed = await getFeedByUrl(url);
    if (!feed) {
        throw new Error(`Feed with url ${url} not found`);
    }

    const feedFollow = await createFeedFollow(feed.id, user.id);
    console.log(`feed name : ${feedFollow.feedName}\nuser name : ${feedFollow.userName}`);
};

export async function handlerUnFollow(cmdName:string, user: User, url:string): Promise<void>{
    if (!url) {
        throw new Error("URL is required for follow command");
    }

    const feed = await getFeedByUrl(url);
    if (!feed) {
        throw new Error(`Feed with url ${url} not found`);
    }

    const DeletedfeedFollow = await deleteFeedFollow(feed.id, user.id);

    if (DeletedfeedFollow) {
        console.log("Feed follow deleted succesufuly");   
    }
};


export async function handlerFeedUserFollow(cmdName:string, user: User): Promise<void>{
    const follows = await getFeedFollowsForUser(user.id);
    if (follows.length === 0) {
        console.log("Not following any feeds");
        return;
    }
    for (const follow of follows) {
        console.log(follow.feedName);
    }
};