import { DefaultFileExport } from "../types";
import checkVersion, { gitHash, gitBranch } from "../utils/version.js";

import { createRequire } from "node:module";
const { version, dependencies: { msgroom: msgroomVersion } } = createRequire(import.meta.url)("../../package.json") as typeof import("../../package.json");

import { Webhook } from "minimal-discord-webhook-node"; // I had to override the types because the provided ones are wrong

let suggestionsWebhook: Webhook | undefined;
if (process.env.YABLUZO_SUGGESTIONS_WEBHOOK) suggestionsWebhook = new Webhook(process.env.YABLUZO_SUGGESTIONS_WEBHOOK);
else console.warn("Environment variable YABLUZO_SUGGESTIONS_WEBHOOK not found, users will not be able to submit suggestions");

const commands: DefaultFileExport = {
    about: () => `I'm Yabluzo, a bot developed by [NanderTGA](https://nandertga.ddns.net).
Do you have any suggestions? Feel free to submit them using \`y!suggest\`!`
+ (process.env.DEV == "true" ? "\n**This bot is a development instance of Yabluzo, expect bugs and unfinished work!**" : ""),

    version: async reply => {
        reply("Checking version, please wait...");

        const versionStatus = await checkVersion()
            .catch(reason => {
                reply("Something went wrong during the version check", reason as string);
                return "(information unavailable)";
            });
        
        return `Yabluzo version ${version} ([${gitHash}](https://github.com/NanderTGA/yabluzo/commit/${gitHash}) at [${gitBranch}](https://github.com/NanderTGA/yabluzo/tree/${gitBranch}))${process.env.DEV == "true" ? " (development instance)" : ""}.
This version is ${versionStatus} compared to the code on [the github repo](https://github.com/NanderTGA/yabluzo).
Running [msgroom](https://www.npmjs.com/package/msgroom) v${msgroomVersion}.`;
    },

    suggest: (reply, ...args) => {
        const suggestion = args.join(" ").trim();
        if (!suggestion || suggestion == "") return "Error: Please provide a suggestion.";
        if (!suggestionsWebhook) return "Error: no suggestions webhook provided. Please tell the developer about this.";
    
        suggestionsWebhook
            .setUsername(`Suggestion from ${"unknown user due to bad command framework"}`)
            .send(`Suggestion: ${suggestion}`)
            .then( () => reply("Your suggestion has been submitted! Thank you for sending us your idea!") )
            .catch( () => reply("Your suggestion could not be submitted. Please try again later.") );
    },
};

export default commands;