import Client from "msgroom";
import dotenv from "dotenv";
import { readdir } from "node:fs/promises";

import { DefaultFileExport } from "./types.js";

dotenv.config();

if (process.env.DEV == "true") {
    console.info("Bot is running in dev mode!");
    if (process.env.YABLUZO_API_KEY) throw new Error("Please do not use an api key while in dev mode!");
}

const prefix = process.env.DEV == "true" ? "yd!" : "y!";
const client = new Client(`[${prefix}] Yabluzo${process.env.YABLUZO_API_KEY ? "" : (process.env.DEV == "true" ? " DEV" : " [BOT]")}`, prefix);

async function addCommandsFromFile(file: string): Promise<void> {
    const { default: defaultFileExports } = await import(`./commands/${file}.js`) as { default?: DefaultFileExport };
    if (!defaultFileExports) throw new Error(`${file} doesn't have a default export. The default export should have the same type as client.commands`);

    if (typeof defaultFileExports == "function") client.commands[defaultFileExports.name] = defaultFileExports;
    else if (typeof defaultFileExports == "object") Object.assign(client.commands, defaultFileExports);
}

const commandFiles = await readdir("./dist/commands");
await Promise.all(commandFiles.map( commandFile => addCommandsFromFile(commandFile.replace(/.(j|t)s$/, "")) ));

await client.connect(undefined, undefined, process.env.YABLUZO_API_KEY);
client.sendMessage("Hi there! I'm Yabluzo. For a list of commands, send `y!help`");
if (process.env.DEV == "true") client.sendMessage("This bot is a dev instance of Yabluzo, expect bugs and unfinished work!");
console.log("Yabluzo has connected to msgroom successfully!");