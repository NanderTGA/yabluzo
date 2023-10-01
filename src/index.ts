import Client from "msgroom";
import "dotenv/config";

if (process.env.DEV == "true") {
    console.info("Bot is running in dev mode!");
    if (process.env.YABLUZO_API_KEY) throw new Error("Please do not use an api key while in dev mode!");
}

const prefix = process.env.DEV == "true" ? "yd!" : "y!";
const name = `[${prefix}] Yabluzo${process.env.YABLUZO_API_KEY ? "" : (process.env.DEV == "true" ? " DEV" : "")}`;
const client = new Client(name, prefix, {
    blockSelf     : true,
    welcomeMessage: `Hi there! I'm Yabluzo. For a list of commands, send \`${prefix}help\``,
});

client.commands.isBlocked = {
    description: "Checks if the provided (session) ID is blocked.",
    handler    : (context, userOrSessionID) => {
        const blocked = client.isBlocked(userOrSessionID, userOrSessionID);
        return `The ID or session ID \`${userOrSessionID}\` is${blocked ? "" : " not"} blocked.`;
    },
};

console.log("Loading modules...");
await client.addCommandsFromDirectory(new URL("./modules", import.meta.url));

console.log("connecting...");
await client.connect();

if (process.env.DEV == "true") client.sendMessage("This bot is a dev instance of Yabluzo, expect bugs and unfinished work!");
console.log("Yabluzo has connected to msgroom successfully!");