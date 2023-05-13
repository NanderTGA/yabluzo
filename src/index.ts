import Client from "msgroom";
import dotenv from "dotenv";
import { Webhook } from "minimal-discord-webhook-node";

dotenv.config();

let suggestionsWebhook: Webhook | undefined;
if (process.env.YABLUKO_SUGGESTIONS_WEBHOOK) suggestionsWebhook = new Webhook(process.env.YABLUKO_SUGGESTIONS_WEBHOOK);
else console.warn("Environment variable YABLUKO_SUGGESTIONS_WEBHOOK not found, users will not be able to submit suggestions");

const client = new Client(`[y!] Yabluzo${process.env.YABLUZO_API_KEY ? "" : " [BOT]"}`, [ "y!" ]);

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

client.commands.about = reply => reply("I'm Yabluzo, a bot developed by [NanderTGA](https://nandertga.ddns.net). Do you have any suggestions? Feel free to submit them using `y!suggest`!");

client.commands["8ball"] = reply => {
    const choices = [
        "It is certian.",
        "It is decidedly so.",
        "Without a doubt.",
        "Yes definitely.",
        "You may rely on it.",
        "As I see it, yes.",
        "Most likely.",
        "Outlook good.",
        "Yes.",
        "Signs point to yes.",
        "Reply hazy, try again.",
        "Ask again later.",
        "Better not tell you now.",
        "Cannot predict now.",
        "Concentrate and ask again.",
        "Don't count on it.",
        "My reply is no.",
        "My sources say no.",
        "Outlook not so good.",
        "Very doubtful.",
    ];

    reply(choices[Math.floor(Math.random() * choices.length)]);
};

client.commands.suggest = (reply, ...args) => {
    const suggestion = args.join(" ").trim();
    if (!suggestion || suggestion == "") return reply("Error: Please provide a suggestion.");
    if (!suggestionsWebhook) return reply("Error: no suggestions webhook provided. Please tell the developer about this.");

    suggestionsWebhook
        .send(`Suggestion: ${suggestion}`)
        .then( () => reply("Your suggestion has been submitted! Thank you for sending us your idea!") )
        .catch( () => reply("Your suggestion could not be submitted. Please try again later."));
};

await client.connect(undefined, undefined, process.env.YABLUZO_API_KEY);
client.sendMessage("Hi there! I'm Yabluzo. For a list of commands, send `y!help`");