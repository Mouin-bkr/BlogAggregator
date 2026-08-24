import { setUser } from "./config";

export type CommandHandler = (cmdName: string, ...args: string[]) => void;
export type CommandsRegistry = { [key: string]: CommandHandler };


export function handlerLogin(cmdName: string, ...args: string[]):void {
    if (args.length < 1) {
        throw new Error("Username is required for login command");
    }
    setUser(args[0]);
    console.log('User has been set');
}
export function registerCommand(registry: CommandsRegistry, cmdName: string, handler: CommandHandler):void{
    registry[cmdName] = handler;
}

export function runCommand(registry: CommandsRegistry, cmdName: string, ...args: string[]):void {
    const handler = registry[cmdName];
    if (!handler) {
        throw new Error(`Command "${cmdName}" not found`);
    }
    handler(cmdName, ...args);
}
    
    