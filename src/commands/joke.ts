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
            const searchResult = await icanhazdadjoke.api.search({ term: searchTerm.join(" "), limit });
            
            let jokeResults = `**Page ${searchResult.current_page}/${searchResult.total_pages}, showing first ${limit} results of ${searchResult.total_jokes}**`;
    
            searchResult.results.forEach( (joke, index) => {
                if (index >= 10) return;
                jokeResults += `\n[${joke.id}](https://icanhazdadjoke.com/j/${joke.id}): ${joke.joke}`;
            });

            if (searchResult.total_jokes > 700) reply(`There currently is a bug in the library we use to handle icanhazdadjoke.com api calls.
Due to this bug, your search terms will be ignored.
We have submitted [a pull request](https://github.com/ffflorian/api-clients/pull/1354) to the library to fix this and apologize for the inconvenience.`);
    
            return jokeResults.trim();
        },
    },
};

export default commands;