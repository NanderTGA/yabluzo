import child from "child_process";
import { Octokit } from "octokit";

const octokit = new Octokit();

// These values don't change while running, so we only run this once.
export const gitHash = child.execSync("git rev-parse HEAD").toString().trim();
export const gitBranch = child.execSync("git rev-parse --abbrev-ref HEAD").toString().trim();
export const gitStatus = child.execSync("git status --porcelain").toString().trim();

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

    if (gitStatus) return "newer";
    if (gitHash == latestCommitHash) return "up-to-date";
    return "outdated";
}

/**
 * - detect uncommited changes
 * - detect unpushed commits
 * - if the branch is not master, check the difference between master and current branch
 */