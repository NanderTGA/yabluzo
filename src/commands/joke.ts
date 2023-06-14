import { ICanHazDadJoke, JokeResult } from "@ffflorian/icanhazdadjoke";
import { DefaultFileExport } from "../types";

const icanhazdadjoke = new ICanHazDadJoke();

function formatJoke(joke: JokeResult): string {
    return `Joke [${joke.id}](https://icanhazdadjoke.com/j/${joke.id}):\n${joke.joke}`;
}

const commands: DefaultFileExport = {
    joke: {
        undefined: async () => {
            const joke = await icanhazdadjoke.api.getRandom();
            return formatJoke(joke);
        },

        get: async (reply, jokeID) => {
            const joke = await icanhazdadjoke.api.getByID(jokeID);
            return formatJoke(joke);
        },

        search: async (reply, ...searchTerm) => {
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
};

export default commands;