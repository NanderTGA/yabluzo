import Client from "msgroom";
import { ClientOptions } from "msgroom/types";
import "dotenv/config";

const dev = process.env.DEV == "true";
if (dev) {
    console.info("Bot is running in dev mode!");
    if (process.env.YABLUZO_API_KEY) throw new Error("Please do not use an api key while in dev mode!");
}

const prefix = dev ? "yd!" : "y!";
const name = `[${prefix}] Yabluzo${process.env.YABLUZO_API_KEY ? "" : (dev ? " DEV" : "")}`;
const options: ClientOptions = {
    blockSelf : true,
    helpSuffix: dev ? "***This bot is a dev instance of Yabluzo, expect bugs and unfinished work!***" : "",
};
const serversOptions: ClientOptions[] = [
    {},
    {
        server     : "wss://msgroom.boomlings.xyz",
        authOptions: {
            loginkey: process.env.MRCS_LOGIN_KEY,
        },
    },
    {
        server: "wss://nandertga.ddns.net:4096",
    },
];

const clients = serversOptions.map( serverOptions => {
    return new Client(name, prefix, {
        ...options,
        ...serverOptions,
    });
});

console.log("Loading modules...");
await Promise.all(clients.map( client => client.loadDirectory(new URL("./modules", import.meta.url)) ));

await Promise.all(clients.map( client => {
    console.log(`Connecting to ${client.server}...`);
    return client.connect()
        .then( () => void console.log(`Connected to ${client.server} successfully!`) )
        .catch( error => void console.error(`Couldn't connect to ${client.server}!`) );
}));