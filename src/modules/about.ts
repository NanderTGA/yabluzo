import checkVersion, { gitHash, gitBranch, checkMsgroomVersion } from "../utils/version.js";
import type { CommandMap, ModuleInitializeFunction } from "msgroom/dist/types/types.js";

import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { version } = require("../../package.json") as typeof import("../../package.json");
const { packages: { "node_modules/msgroom": { version: msgroomVersion } } } = require("../../package-lock.json") as typeof import("../../package-lock.json");


const initialize: ModuleInitializeFunction = client => ({
    about: {
        description: "Tells you more about this bot.",
        handler    : () => `I'm Yabluzo, a bot developed by [NanderTGA](https://nandertga.ddns.net).
                            Do you have any suggestions? Feel free to let us know in our Discord server or open an issue!`
        + (process.env.DEV == "true" ? "\n**This bot is a development instance of Yabluzo, expect bugs and unfinished work!**" : ""),
    },

    version: {
        description: "Shows version information.",
        handler    : async context => {
            context.send("Checking version, please wait...");
    
            const [ versionStatus, msgroomStatus ] = await Promise.all([ checkVersion(), checkMsgroomVersion(msgroomVersion) ]);

            const commit = `[${gitHash}](https://github.com/NanderTGA/yabluzo/commit/${gitHash})`;
            const branch = `[${gitBranch}](https://github.com/NanderTGA/yabluzo/tree/${gitBranch})`;
            const msgroomUpdateAvailable = msgroomStatus.upToDateStatus == "outdated" ? `\nThere is a new version of msgroom available! (v${msgroomStatus.latestVersion})` : "";
            
            return `Yabluzo version ${version} (${commit} at ${branch}) ${process.env.DEV == "true" ? "(development instance)" : ""}.
                    This version is ${versionStatus} compared to the code on [the github repo](https://github.com/NanderTGA/yabluzo).

                    Running [MsgRoom.js](https://nandertga.github.io/msgroom-orm/) v${msgroomVersion}.${msgroomUpdateAvailable}`;
        },
    },

    discord: {
        description: "Join our discord server.",
        handler    : () => `You can join NanderTGA's discord server [here](https://discord.com/invite/YRHpTvV)`,
    },

    source: {
        description: "View Yabluzo's source code.",
        handler    : () => `Yabluzo's source code can be found [here](https://github.com/NanderTGA/yabluzo)
                            Do you want to make your own bot? Yabluzo uses [MsgRoom.js](https://nandertga.github.io/msgroom-orm/).`,
    },

    funFact: {
        description: "Tells you a fun fact.",
        handler    : () => `**Who is SpamHook [BOT]?**
                            [SpamHook](https://replit.com/@replDestroyer1234/spamhook#index.js) is a bot created by æ to log all messages to a discord server of them.
                            It is hosted on [Replit](https://replit.com) and frequently stops because of Replit automatically stopping REPLs after a certain period of time.`,
    },
} satisfies CommandMap);

export default initialize;