import { Feed, User } from "./lib/db/schema";

export function printFeed(feed:Feed,user: User){
    console.log(`* ID:        ${feed.id}`);
    console.log(`* Created:   ${feed.createdAt}`);
    console.log(`* Updated:   ${feed.updatedAt}`);
    console.log(`* Name:      ${feed.name}`);
    console.log(`* URL:       ${feed.url}`);
    console.log(`* User:      ${user.name}`);
}