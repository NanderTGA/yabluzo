import { DefaultFileExport } from "../types";
import checkVersion, { gitHash, gitBranch } from "../utils/version.js";

import { createRequire } from "node:module";
const { version } = createRequire(import.meta.url)("../../package.json") as { version: string };

const commands: DefaultFileExport = {
    about: () => `I'm Yabluzo, a bot developed by [NanderTGA](https://nandertga.ddns.net).
Do you have any suggestions? Feel free to submit them using \`y!suggest\`!`
+ (process.env.DEV == "true" ? "\n**This bot is a development instance of Yabluzo, expect bugs and unfinished work!**" : ""),

    version: async reply => {
        reply("Checking version, please wait... (This command is being developed right now, this is just a preview of it)");

        const versionStatus = await checkVersion();
        return `Yabluzo version ${version} (${gitHash} at ${gitBranch})${process.env.DEV == "true" ? " (development instance)" : ""}. this version is `;
    },
};

export default commands;