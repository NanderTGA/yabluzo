import Client from "msgroom";
import dotenv from "dotenv";
import { Webhook } from "minimal-discord-webhook-node";
import { readdirSync } from "node:fs";

import { DefaultFileExport } from "./types.js";

dotenv.config();

let suggestionsWebhook: Webhook | undefined;
if (process.env.YABLUZO_SUGGESTIONS_WEBHOOK) suggestionsWebhook = new Webhook(process.env.YABLUZO_SUGGESTIONS_WEBHOOK);
else console.warn("Environment variable YABLUZO_SUGGESTIONS_WEBHOOK not found, users will not be able to submit suggestions");
if (process.env.DEV == "true") console.info("Bot is running in dev mode!");
if (process.env.DEV == "true" && process.env.YABLUZO_API_KEY) throw new Error("Please do not use an api key while in dev mode, exiting.");

const client = new Client(`[y!] Yabluzo${process.env.YABLUZO_API_KEY ? "" : (process.env.DEV == "true" ? " [DEV]" : " [BOT]")}`, "y!");

client.on("message", message => {
    if (message.id == client.userID) return;
    const monkey: Record<string, string> = {
        "hey"        : "hey",
        "gn"         : "gn",
        "gm"         : "gm",
        "goodmorning": "goodmorning",
        "goodnight"  : "goodnight",
        "who's joe?" : "Joe mama",
        "who's joe"  : "Joe mama",
        "f"          : "Respect paid.",
    };
    if (monkey[message.content.toLowerCase()]) return client.sendMessage(monkey[message.content.toLowerCase()]);
});

async function addCommandsFromFile(file: string): Promise<void> {
    const { default: defaultFileExports } = await import(`./commands/${file}.js`) as { default?: DefaultFileExport };
    if (!defaultFileExports) throw new Error(`${file} doesn't have a default export. The default export should have the same type as client.commands`);

    if (typeof defaultFileExports == "function") client.commands[defaultFileExports.name] = defaultFileExports;
    else if (typeof defaultFileExports == "object") Object.assign(client.commands, defaultFileExports);
}

await Promise.all(readdirSync("./dist/commands").map( commandFile => addCommandsFromFile(commandFile.replace(/.(j|t)s$/, "")) ));

client.commands.suggest = (reply, ...args) => {
    const suggestion = args.join(" ").trim();
    if (!suggestion || suggestion == "") return reply("Error: Please provide a suggestion.");
    if (!suggestionsWebhook) return reply("Error: no suggestions webhook provided. Please tell the developer about this.");

    suggestionsWebhook
        .send(`Suggestion: ${suggestion}`)
        .then( () => reply("Your suggestion has been submitted! Thank you for sending us your idea!") )
        .catch( () => reply("Your suggestion could not be submitted. Please try again later.") );
};

await client.connect(undefined, undefined, process.env.YABLUZO_API_KEY);
client.sendMessage("Hi there! I'm Yabluzo. For a list of commands, send `y!help`");
if (process.env.DEV) client.sendMessage("This bot is a dev instanceof Yabluzo, expect bugs and unfinished work!");
console.log("Yabluzo has connected to msgroom successfully!");