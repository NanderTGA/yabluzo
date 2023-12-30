import Client from "msgroom";
import "dotenv/config";

const dev = process.env.DEV == "true";
if (dev) {
    console.info("Bot is running in dev mode!");
    if (process.env.YABLUZO_API_KEY) throw new Error("Please do not use an api key while in dev mode!");
}

const prefix = dev ? "yd!" : "y!";
const name = `[${prefix}] Yabluzo${process.env.YABLUZO_API_KEY ? "" : (dev ? " DEV" : "")}`;

const client = new Client(name, prefix, {
    blockSelf : true,
    helpSuffix: "***This bot is a dev instance of Yabluzo, expect bugs and unfinished work!***",
});

console.log("Loading modules...");
await client.loadDirectory(new URL("./modules", import.meta.url));

console.log("connecting...");
await client.connect();

console.log("Yabluzo has connected to msgroom successfully!");