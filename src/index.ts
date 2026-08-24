import { handlerLogin, registerCommand, runCommand, CommandsRegistry } from "./commands";

function main() {
const commandRegistry: CommandsRegistry = {};

registerCommand(commandRegistry, "login", handlerLogin);
const cliArgs = process.argv.slice(2);
if (cliArgs.length < 1) {
  console.log("No command provided");
  process.exit(1);
}
 const [first, ...remaining] = cliArgs;
 try {
 runCommand(commandRegistry, first, ...remaining);

} catch (error) {
  console.error("Error occurred while running command:", error);
  process.exit(1);
}
}
main();

