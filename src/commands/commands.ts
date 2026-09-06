export type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>;
export type CommandsRegistry = { [key: string]: CommandHandler };


export async function registerCommand(registry: CommandsRegistry, cmdName: string, handler: CommandHandler): Promise<void> {
    registry[cmdName] = handler;
};

export async function runCommand(registry: CommandsRegistry, cmdName: string, ...args: string[]): Promise<void> {
    const handler = registry[cmdName];
    if (!handler) {
        throw new Error(`Command "${cmdName}" not found`);
    }
    await handler(cmdName, ...args);
};
    
    