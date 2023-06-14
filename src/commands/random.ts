import { DefaultFileExport } from "../types";

import random from "random";
const { integer: randomInteger, float: randomFloat } = random;

export function randomValueFromArray<T>(array: T[]): T;
export function randomValueFromArray(array: string): string;
export function randomValueFromArray<T>(array: T[] | string): T | string {
    const randomIndex = randomInteger(0, array.length - 1);
    const randomValue = array[randomIndex];

    return randomValue;
}

const commands: DefaultFileExport = {
    "8ball": () => {
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
    
        return randomValueFromArray(choices);
    },

    coin: () => {
        const choices = [
            "Heads.",
            "Tails.",
        ];
    
        return randomValueFromArray(choices);
    },

    random: (reply, minimumAsString, maximumAsString) => {
        const minimum = parseFloat(minimumAsString);
        const maximum = parseFloat(maximumAsString);

        if (!minimum || !maximum) return "Please specify a minimum and a maximum number.";

        const isFloat = !Number.isInteger(minimum)
                        || !Number.isInteger(maximum)
                        || minimumAsString.includes(".")
                        || maximumAsString.includes(".");
        const randomFunction = isFloat ? randomFloat : randomInteger;

        const random = randomFunction(minimum, maximum);
        return random.toString();
    },

    dice: (reply, maximumAsString = "6") => {
        const maximum = parseInt(maximumAsString);
        const random = randomInteger(1, maximum);
        return random.toString();
    },
};

export default commands;