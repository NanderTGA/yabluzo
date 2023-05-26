import child from "child_process";
import { Octokit } from "octokit";

const octokit = new Octokit();

/**
 * Gets the output of a process.
 * @param command The process to execute.
 * @returns The output of the spawned process.
 */
export async function getOutput(command: string): Promise<string> {
    return new Promise( (resolve, reject) => {
        const processArguments = command.split(" ");
        const processName = processArguments[0];

        const process = child.spawn(processName, processArguments.slice(1));

        if (!process.stdout || !process.stderr) throw new Error("Process could not be spawned");

        process.stdout.on("data", (data: string) => resolve(data.toString().replaceAll("\n", "")));
        process.stderr.on("data", (data: string) => reject(data.toString().replaceAll("\n", "")));
    });
}

// These values don't change while running, so we only run this once.
export const gitHash = await getOutput("git rev-parse HEAD");
export const gitBranch = await getOutput("git rev-parse --abbrev-ref HEAD");
export const gitStatus = await getOutput("git status --porcelain");

export async function getCommit(ref: string) {
    return await octokit.request("GET /repos/{owner}/{repo}/commits/{ref}", {
        owner: "NanderTGA",
        repo : "yabluzo",
        ref,
    });
}

export async function getLatestCommitHash() {
    const latestCommit = await getCommit("HEAD");
    return latestCommit.data.sha;
}

export default async function checkVersion(): Promise<"up-to-date" | "outdated" | "newer"> {
    const latestCommitHash = await getLatestCommitHash();

    if (gitHash == latestCommitHash) return "up-to-date";
    //if (gitStatus) console.log(gitStatus);
    console.log(gitStatus, !!gitStatus);
    return "newer";
    return "outdated";
}