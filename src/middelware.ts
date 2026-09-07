import { CommandHandler } from "./commands/commands";
import { readConfig } from "./config";
import { getUserByName } from "./lib/db/queries/users";
import { User } from "./lib/db/schema";

export type UserCommandHandler = (
  cmdName: string,
  user: User,
  ...args: string[]
) => Promise<void>;


export function middlewareLoggedIn(handler: UserCommandHandler): CommandHandler {
  return async  (cmdName: string, ...args: string[]): Promise<void> => {
 const config = readConfig();
    const user = await getUserByName(config.currentUserName);
    if (!user) {
        throw new Error(`User ${config.currentUserName} not found`);
    }
    
   await handler(cmdName,user,...args)
};
}