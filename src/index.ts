import { setDefaultResultOrder } from "node:dns";
import { CommandsRegistry, registerCommand, runCommand } from "./commands/commands";
import { handlerDeleteUsers, handlerGetUsers, handlerLogin, handlerRegister } from "./commands/users";
import { handlerFetchFeed, handlerInsertFeed, handlerShowAllFeeds } from "./commands/feeds";
import { handlerFeedUserFollow, handlerFollow } from "./commands/feed-follows";
setDefaultResultOrder("ipv4first");

async function main() {
const commandRegistry: CommandsRegistry = {};

registerCommand(commandRegistry, "login", handlerLogin);
registerCommand(commandRegistry, "register", handlerRegister)
registerCommand(commandRegistry, "reset", handlerDeleteUsers)
registerCommand(commandRegistry, "users", handlerGetUsers )
registerCommand(commandRegistry, "agg", handlerFetchFeed )
registerCommand(commandRegistry, "addfeed", handlerInsertFeed)
registerCommand(commandRegistry, "feeds", handlerShowAllFeeds)
registerCommand(commandRegistry, "follow" ,handlerFollow)
registerCommand(commandRegistry, "following", handlerFeedUserFollow)


const cliArgs = process.argv.slice(2);
if (cliArgs.length < 1) {
  console.log("No command provided");
  process.exit(1);
}
 const [first, ...remaining] = cliArgs;
 try {
await runCommand(commandRegistry, first, ...remaining);

} catch (error) {
  console.error("Error occurred while running command:", error);
  process.exit(1);
}
process.exit(0);
}
main();

