import { handlerLogin, registerCommand, runCommand, CommandsRegistry, handlerRegister, handlerDeleteUsers } from "./commands";

async function main() {
const commandRegistry: CommandsRegistry = {};

registerCommand(commandRegistry, "login", handlerLogin);
registerCommand(commandRegistry, "register", handlerRegister)
registerCommand(commandRegistry, "reset", handlerDeleteUsers)
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

