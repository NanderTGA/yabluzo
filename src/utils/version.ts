import child from "child_process";
import { Octokit } from "octokit";
import { gt as semverGreaterThan, lt as semverLessThan } from "semver";

const octokit = new Octokit({ auth: process.env.GITHUB_PERSONAL_ACCESS_TOKEN });

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

export type UpToDateStatus = "up-to-date" | "outdated" | "newer" | "[INFORMATION UNAVAILABLE]";

export default async function checkVersion(): Promise<UpToDateStatus> {
    let latestCommitHash;
    try {
        latestCommitHash = await getLatestCommitHash();
    } catch {
        return "[INFORMATION UNAVAILABLE]";
    }

    if (gitStatus) return "newer";
    if (gitHash == latestCommitHash) return "up-to-date";
    return "outdated";
}

export async function checkMsgroomVersion(currentVersion: string): Promise<{
    latestVersion: string,
    upToDateStatus: UpToDateStatus
}> {
    let latestVersion;
    try {
        const latestPackageJSON = await fetch("https://registry.npmjs.org/msgroom/latest").then( response => response.json() ) as typeof import("msgroom/package.json");
        latestVersion = latestPackageJSON.version;
    } catch {
        return { latestVersion: "[INFORMATION UNAVAILABLE]", upToDateStatus: "[INFORMATION UNAVAILABLE]" };
    }

    if (currentVersion == latestVersion) return { latestVersion, upToDateStatus: "up-to-date" };
    if (semverLessThan(currentVersion, latestVersion)) return { latestVersion, upToDateStatus: "outdated" };
    if (semverGreaterThan(currentVersion, latestVersion)) return { latestVersion, upToDateStatus: "newer" };

    throw new Error("This code can never run");
}

/**
 * - detect uncommited changes
 * - detect unpushed commits
 * - if the branch is not master, check the difference between master and current branch
 */