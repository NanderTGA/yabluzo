import { ICanHazDadJoke, JokeResult } from "@ffflorian/icanhazdadjoke";
import { DefaultFileExport } from "../types";

const icanhazdadjoke = new ICanHazDadJoke();

const joke: DefaultFileExport = async (reply, subCommand, ...args) => {
    let joke: JokeResult;
    
    if (subCommand == "get") joke = await icanhazdadjoke.api.getByID(args[0]);
    else if (subCommand == "search") {
        const limit = 10;
        const searchResult = await icanhazdadjoke.api.search({ term: args.join(" "), limit });
            
        let jokeResults = `**Page ${searchResult.current_page}/${searchResult.total_pages}, showing first ${limit} results of ${searchResult.total_jokes}**`;
    
        searchResult.results.forEach( (jokeResult, index) => {
            if (index >= 10) return;
            jokeResults += `\n[${jokeResult.id}](https://icanhazdadjoke.com/j/${jokeResult.id}): ${jokeResult.joke}`;
        });
    
        return reply(jokeResults.trim());
    } else joke = await icanhazdadjoke.api.getRandom();
    
    return reply(`Joke [${joke.id}](https://icanhazdadjoke.com/j/${joke.id}):\n${joke.joke}`);
};

export default joke;