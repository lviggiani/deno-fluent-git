import { cmd } from "./command-utils.ts";
import { resolve } from "jsr:@std/path@^0.224.0";
import { CommitInfo } from "./CommitInfo.ts";
import { GitStatus } from "./GitStaus.ts";

const output = await cmd("git", ["--version"]).catch(_ => { throw "git not installed" });
console.log(`using ${output?.text()}`);

export class Repo {
    private dir:string;

    constructor(dir:string){
        this.dir = dir;
    }

    async getCommits():Promise<CommitInfo[]>{
        const command = await cmd("git", ["log"], this.dir);

        return command?.success ?
            (command.text() || "")
            .split(/^commit\s+/m)
            .filter(item => !!item)
            .map(log => CommitInfo.parse(log)) : [];
    }

    async getStatus():Promise<GitStatus>{
        const ret = {
            changed: [],
            removed: [],
            untracked: []
        } as GitStatus;

        const command = await cmd("git", ["status", "-s"]);
        return command?.success ?
            (await command.text()).split("\n").reduce((ret, current) => {
                const [t, file] = current.trim().split(/\s+/);
                switch (t){
                    case "??": ret.untracked.push(file); break;
                    case "D": ret.removed.push(file); break;
                    case "M": ret.changed.push(file); break;
                    default: console.warn(`Unhandled git status ${t}`);
                }
                return ret;
            }, ret) : ret;
    }

    static async open(dir:string):Promise<Repo|undefined>{
        dir = resolve(dir);
        const output = await cmd("git", ["rev-parse", "--git-dir"], dir).catch(_ => undefined);
        if (!output?.success) return undefined;

        return new Repo(resolve(output!.text().trim().replace(/\.git$/, "")));
    }
}