import { readConfig } from "src/config";
import { createFeedFollow, getFeedByUrl, getFeedFollowsForUser } from "src/lib/db/queries/feed";
import { getUserByName } from "src/lib/db/queries/users";


export async function handlerFollow(cmdName:string,url:string): Promise<void>{
    if (!url) {
        throw new Error("URL is required for follow command");
    }
    const config = readConfig();
    const user = await getUserByName(config.currentUserName);
    if (!user) {
        throw new Error(`User ${config.currentUserName} not found`);
    }

    const feed = await getFeedByUrl(url);
    if (!feed) {
        throw new Error(`Feed with url ${url} not found`);
    }

    const feedFollow = await createFeedFollow(feed.id, user.id);
    console.log(`feed name : ${feedFollow.feedName}\nuser name : ${feedFollow.userName}`);
};

export async function handlerFeedUserFollow(cmdName:string): Promise<void>{
    const config = readConfig();
    const user = await getUserByName(config.currentUserName);
    if (!user) {
        throw new Error(`User ${config.currentUserName} not found`);
    }

    const follows = await getFeedFollowsForUser(user.id);
    if (follows.length === 0) {
        console.log("Not following any feeds");
        return;
    }
    for (const follow of follows) {
        console.log(follow.feedName);
    }
};