import { DefaultFileExport } from "../types";
import checkVersion, { gitHash, gitBranch } from "../utils/version.js";

import { createRequire } from "node:module";
const { version } = createRequire(import.meta.url)("../../package.json") as { version: string };

import { Webhook } from "minimal-discord-webhook-node";

let suggestionsWebhook: Webhook | undefined;
if (process.env.YABLUZO_SUGGESTIONS_WEBHOOK) suggestionsWebhook = new Webhook(process.env.YABLUZO_SUGGESTIONS_WEBHOOK);
else console.warn("Environment variable YABLUZO_SUGGESTIONS_WEBHOOK not found, users will not be able to submit suggestions");

const commands: DefaultFileExport = {
    about: () => `I'm Yabluzo, a bot developed by [NanderTGA](https://nandertga.ddns.net).
Do you have any suggestions? Feel free to submit them using \`y!suggest\`!`
+ (process.env.DEV == "true" ? "\n**This bot is a development instance of Yabluzo, expect bugs and unfinished work!**" : ""),

    version: async reply => {
        reply("Checking version, please wait... (This command is being developed right now, this is just a preview of it)");

        const versionStatus = await checkVersion()
            .catch(reason => {
                reply("Something went wrong during the version check", reason as string);
                return "(information unavailable)";
            });
        
        return `Yabluzo version ${version} (${gitHash} at ${gitBranch})${process.env.DEV == "true" ? " (development instance)" : ""}.
This version is ${versionStatus} compared to the code on [the github repo](https://github.com/NanderTGA/yabluzo)`;
    },

    suggest: (reply, ...args) => {
        const suggestion = args.join(" ").trim();
        if (!suggestion || suggestion == "") return reply("Error: Please provide a suggestion.");
        if (!suggestionsWebhook) return reply("Error: no suggestions webhook provided. Please tell the developer about this.");
    
        suggestionsWebhook
            .send(`Suggestion: ${suggestion}`)
            .then( () => reply("Your suggestion has been submitted! Thank you for sending us your idea!") )
            .catch( () => reply("Your suggestion could not be submitted. Please try again later.") );
    },
};

export default commands;