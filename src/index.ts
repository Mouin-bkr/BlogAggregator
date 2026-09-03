import { setDefaultResultOrder } from "node:dns";
import { handlerLogin, registerCommand, runCommand, CommandsRegistry, handlerRegister, handlerDeleteUsers, handlerGetUsers, handlerFetchFeed } from "./commands";

setDefaultResultOrder("ipv4first");

async function main() {
const commandRegistry: CommandsRegistry = {};

registerCommand(commandRegistry, "login", handlerLogin);
registerCommand(commandRegistry, "register", handlerRegister)
registerCommand(commandRegistry, "reset", handlerDeleteUsers)
registerCommand(commandRegistry, "users", handlerGetUsers )
registerCommand(commandRegistry, "agg", handlerFetchFeed )

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

