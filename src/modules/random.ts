import { CommandMap, ModuleInitializeFunction } from "msgroom/dist/types/types.js";

import random from "random";
const { integer: randomInteger, float: randomFloat } = random;
const randomValueFromArray = random.choice.bind(random);

const initialize: ModuleInitializeFunction = client => ({
    "8ball": {
        description: "Ask me a question and I'll tell you what I think about it.",
        aliases    : [ [ "ask" ] ],
        handler    : () => randomValueFromArray([
            "It is certain.",
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
        ]),
    },

    coin: {
        description: "Flip a coin.",
        aliases    : [ [ "flipACoin" ] ],
        handler    : () => randomValueFromArray([
            "Heads.",
            "Tails.",
        ]),
    },

    random: {
        description: "Gives you a random number. Supports decimals!",
        aliases    : [ [ "randomNumber" ] ],
        handler    : (context, minimumAsString, maximumAsString) => {
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
    },

    dice: {
        description: "Rolls a dice. You can also change how many sides the dice has!",
        aliases    : [ [ "rollADice" ] ],
        handler    : (reply, maximumAsString = "6") => {
            const maximum = maximumAsString.toLowerCase() == "munchkin" ? 20 : parseInt(maximumAsString);

            const random = randomInteger(1, maximum);
            return random.toString();
        },
    },
} satisfies CommandMap);

export default initialize;