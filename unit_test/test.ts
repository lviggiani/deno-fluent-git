import { assert } from "jsr:@std/assert";
import { Repo } from "../lib/Repo.ts";
import { join } from "jsr:@std/path";
import { GitAuthor } from "../lib/GitAuthor.ts";

Deno.test("Open", async () => {
    const repo = await Repo.open(".");

    console.log(await repo?.getCommits());
    console.log(await repo?.getStatus());
});

Deno.test("Init", async () => {
    const dir = await Deno.makeTempDir();
    console.log(dir);

    const repo = await Repo.init(dir);
    assert(repo !== undefined);

    console.log(await repo.getStatus());
});

Deno.test("Add and commit", async() => {
    const dir = await Deno.makeTempDir();
    const repo = await Repo.init(dir);
    assert(repo !== undefined);

    await Deno.writeTextFile(join(dir, "test-file.txt"), "Some test file");
    let status = await repo.getStatus();
    assert(status.untracked.length === 1);

    assert(await repo.addAll() === true);
    status = await repo.getStatus();
    assert(status.untracked.length === 0 && status.added.length === 1);

    let commitInfo = await repo.commit("First test commit").catch(() => undefined);
    assert(commitInfo === undefined);

    repo.author = new GitAuthor("John Smith", "john@somewhere.net");
    commitInfo = await repo.commit("First test commit");

    assert(commitInfo);
    assert(commitInfo.author?.email == "john@somewhere.net");
    assert(commitInfo.comment == "First test commit");

    console.log(commitInfo);
    
    await Deno.remove(dir, { recursive: true });
});