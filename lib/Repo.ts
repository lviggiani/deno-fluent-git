import { cmd } from "./command-utils.ts";
import { resolve } from "jsr:@std/path@^0.224.0";

const output = await cmd("git", ["--version"]).catch(_ => { throw "git not installed" });
console.log(`using ${output?.text()}`);

export class Repo {
    private dir:string;

    constructor(dir:string){
        this.dir = dir;
    }

    async getCommits():Promise<string[]>{
        const command = (await cmd("git", ["log"], this.dir));
        if (!command?.success) return [];
        return [command?.text() || ""];
    }

    static async open(dir:string):Promise<Repo|undefined>{
        dir = resolve(dir);
        const output = await cmd("git", ["rev-parse", "--git-dir"], dir).catch(_ => undefined);
        if (!output?.success) return undefined;

        return new Repo(resolve(output!.text().trim().replace(/\.git$/, "")));
    }
}