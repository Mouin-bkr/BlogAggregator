import { readConfig, setUser } from "./config";
import { fetchFeed } from "./rss";
import { createUser, deleteUsers, getUserByName, getUsers } from "./lib/db/queries/users";
import { addFeed, createFeed, getFeedsWithName } from "./lib/db/queries/feed";
import { feeds } from "./lib/db/schema";

export type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>;
export type CommandsRegistry = { [key: string]: CommandHandler };


export async function handlerLogin(cmdNale:string,...args: string[]): Promise<void> {
    if (args.length < 1) {
        throw new Error("Username is required for login command");
    }
    if(!await getUserByName(args[0])) {
        throw new Error("User does not exist");
    }
    setUser(args[0]);
    console.log('User has been set');
}
export async function handlerRegister( cmdName:string ,...args: string[]): Promise<void> {
    if (args.length < 1) {
        throw new Error("Username is required for register command");
    }
    if(await getUserByName(args[0])) {
        throw new Error("User already exists");
    }
    const user = await createUser(args[0]);
    if (!user) {
        throw new Error("Failed to create user");
    }
    else{
        console.log('User has been created:', await getUserByName(user.name));
        setUser(user.name); 
    }
    
}

export async function handlerDeleteUsers() : Promise<void> {
    const result = await deleteUsers();
    return result ? console.log("All users have been deleted") : console.log("Failed to delete users");
}

export async function handlerGetUsers() : Promise<void> {
    const users = await getUsers();
    const config = readConfig();
    if (users.length === 0) {
        console.log("No users found");
    }
    else {
        
        users.forEach(user => { 
            if ((user.name)==(config.currentUserName) ) { 
                    console.log(`* ${user.name} (current)`);
            } 
            else {
                console.log(`* ${user.name}`);
            }
        });
        }
    
}
export async function handlerFetchFeed(cmdName:string) : Promise<void> {
    const feed = await fetchFeed("https://www.wagslane.dev/index.xml")
    const result = JSON.stringify(feed, null, 2)    
    console.log(result);
}

export async function handlerInsertFeed(cmdName:string, ...args: string[]): Promise<void> {
   console.log("add feed function being called")
   const config = readConfig();
   const user = await getUserByName(config.currentUserName);

    if (!user) {
  throw new Error(`User ${config.currentUserName} not found`);
}
    if(args.length === 2) {
    const result = await addFeed(args[0],args[1],user.id)
    console.log(result)
    
    }
    else{
        throw new Error("missing args")
    }

}

export async function handlerShowAllFeeds(cmdName:string): Promise<void>{
    console.log("handler show all feeds called")
    const result =await getFeedsWithName() 
    console.log(result)
    for( const res of result){
        console.log(`feed name : ${res.feedName}\nfeed url : ${res.feedUrl}\nuser name : ${res.userName}`)
    }
}

export async function registerCommand(registry: CommandsRegistry, cmdName: string, handler: CommandHandler): Promise<void> {
    registry[cmdName] = handler;
}

export async function runCommand(registry: CommandsRegistry, cmdName: string, ...args: string[]): Promise<void> {
    const handler = registry[cmdName];
    if (!handler) {
        throw new Error(`Command "${cmdName}" not found`);
    }
    await handler(cmdName, ...args);
}
    
    