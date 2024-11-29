import { Repo } from "./lib/Repo.ts";

const repo = await Repo.open(".");

console.log(await repo?.getCommits());
console.log(await repo?.getStatus());