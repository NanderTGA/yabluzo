import { ICanHazDadJoke, JokeResult } from "@ffflorian/icanhazdadjoke";
import type { CommandWithName, ModuleInitializeFunction } from "msgroom/dist/types/types.js";

const icanhazdadjoke = new ICanHazDadJoke();

function formatJoke(joke: JokeResult): string {
    return `Joke [${joke.id}](https://icanhazdadjoke.com/j/${joke.id}):\n${joke.joke}`;
}

const initialize: ModuleInitializeFunction = client => ({
    name       : "joke",
    aliases    : [ [ "icanhazdadjoke" ] ],
    description: "Tells you a random joke (using [icanhazdadjoke](https://icanhazdadjoke.com)).",
    handler    : async () => {
        const joke = await icanhazdadjoke.api.getRandom();
        return formatJoke(joke);
    },
    subcommands: {
        get: {
            description: "Gets a joke using its ID.",
            handler    : async (context, jokeID) => {
                const joke = await icanhazdadjoke.api.getByID(jokeID);
                return formatJoke(joke);
            },
        },
        search: {
            description: "Searches for a joke.",
            aliases    : [ [ "joke", "find" ] ],
            handler    : async (context, ...searchTerm) => {
                const limit = 10;
                const searchResult = await icanhazdadjoke.api.search(searchTerm.join(" "), { limit });
                
                let jokeResults = `**Page ${searchResult.current_page}/${searchResult.total_pages}, showing first ${limit} results of ${searchResult.total_jokes}**`;
        
                searchResult.results.forEach( (joke, index) => {
                    if (index >= 10) return;
                    jokeResults += `\n[${joke.id}](https://icanhazdadjoke.com/j/${joke.id}): ${joke.joke}`;
                });
        
                return jokeResults.trim();
            },
        },
    },
} satisfies CommandWithName);

export default initialize;