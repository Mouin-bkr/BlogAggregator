import { readConfig, setUser } from "src/config";
import { createUser, deleteUsers, getUserByName, getUsers } from "src/lib/db/queries/users";

export async function handlerLogin(cmdNale:string,...args: string[]): Promise<void> {
    if (args.length < 1) {
        throw new Error("Username is required for login command");
    }
    if(!await getUserByName(args[0])) {
        throw new Error("User does not exist");
    }
    setUser(args[0]);
    console.log('User has been set');
};

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
    
};

export async function handlerDeleteUsers() : Promise<void> {
    const result = await deleteUsers();
    return result ? console.log("All users have been deleted") : console.log("Failed to delete users");
};


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
    
};