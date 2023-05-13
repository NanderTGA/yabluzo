import { DefaultFileExport } from "../types";

const commands: DefaultFileExport = {
    "8ball": reply => {
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
    },

    coin: reply => {
        const choices = [
            "Heads.",
            "Tails.",
        ];
    
        reply(choices[Math.floor(Math.random() * choices.length)]);
    },
};

export default commands;