import { cmd } from "./command-utils.ts";
import { resolve } from "jsr:@std/path@^0.224.0";
import { CommitInfo } from "./CommitInfo.ts";
import type { GitStatus } from "./GitStaus.ts";
import { assert } from "jsr:@std/assert@^0.224.0/assert";
import type { GitAuthor } from "./GitAuthor.ts";

const output = await cmd("git", ["--version"]).catch(_ => { throw "git not installed" });
console.log(`using ${output?.text()}`);

export class Repo {
    #dir:string;
    #author?:GitAuthor;
    
    constructor(dir:string){
        this.#dir = dir;
    }

    /**
     * Gets all the commits of the repo
     * @returns an array of CommitInfo includin hash, ahtor, date-time, commit message
     */
    async getCommits():Promise<CommitInfo[]>{
        const command = await cmd("git", ["log"], this.#dir);

        return command?.success ?
            (command.text() || "")
            .split(/^commit\s+/m)
            .filter(item => !!item)
            .map(log => CommitInfo.parse(log)) : [];
    }

    /**
     * Show current repo status
     * @returns a GitStatus structure showing added, changed, removed and untracked files
     */
    async getStatus():Promise<GitStatus>{
        const ret = {
            added: [],
            changed: [],
            removed: [],
            untracked: []
        } as GitStatus;

        const command = await cmd("git", ["status", "-s"], this.#dir);
        return command?.success ?
            (await command.text()).split("\n").reduce((ret, current) => {
                const [t, file] = current.trim().split(/\s+/);
                switch (t){
                    case "??": ret.untracked.push(file); break;
                    case "D": ret.removed.push(file); break;
                    case "M": ret.changed.push(file); break;
                    case "A": ret.added.push(file); break;
                    case "": break;
                    default: console.warn(`Unhandled git status '${t}'`);
                }
                return ret;
            }, ret) : ret;
    }

    /**
     * Stages all files including untracked
     * @returns true if success or false otherwise
     */
    async addAll():Promise<boolean>{
        const command = await cmd("git", ["add", "--all"], this.#dir);
        return !!command?.success;
    }

    /**
     * Commit changes
     * @param message Commit message (required)
     * @param author Commit author (defaults to Repo.author if set) (required)
     * @returns a CommitInfo structure in case of success or undefined
     */
    async commit(message:string, author:GitAuthor|undefined = this.#author):Promise<CommitInfo|undefined>{
        if (!message) throw "message connot be empty";
        if (!author) throw "missing author";

        const command = await cmd("git", [
            "commit", 
            "-m", message, 
            `--author="${author.toString()}"`], this.#dir);

        if (!command?.success) return undefined;

        return (await this.getCommits()).at(0);
    }

    get author():GitAuthor|undefined {
        return this.#author;
    }

    set author(value:GitAuthor|undefined){
        this.#author = value;
    }

    /**
     * Open an existing local git repository
     * @param dir path to local git repo
     * @returns a Repo instance to manage the repo
     */
    static async open(dir:string):Promise<Repo|undefined>{
        dir = resolve(dir);
        const output = await cmd("git", ["rev-parse", "--git-dir"], dir).catch(_ => undefined);
        if (!output?.success) return undefined;

        return new Repo(resolve(output!.text().trim().replace(/\.git$/, "")));
    }

    /**
     * Inits an existing folder as a local git repository
     * @param dir path to existing local folder
     * @returns a Repo instance to manage the repo
     */
    static async init(dir:string):Promise<Repo|undefined>{
        dir = resolve(dir);
        const fileInfo = await Deno.stat(dir);
        assert(fileInfo.isDirectory);

        const repo = await this.open(dir);
        if (repo) throw "Repo already initialized";

        const output = await cmd("git", ["init"], dir).catch(_ => undefined);
        if (!output?.success) return undefined;

        return new Repo(dir);
    }
}