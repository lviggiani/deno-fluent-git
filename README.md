# Deno Fluent Git

Simple Git bindings for Deno.
Uses native git commands rather than libgit2 direct binding

**Very early stage**

## Example

### Create a repository, add file and commit

```typescript
// Create and init repo
const dir = await Deno.makeTempDir();
const repo = await Repo.init(dir);

// Put some content
await Deno.writeTextFile(join(dir, "test-file.txt"), "Some test file");
let status = await repo.getStatus();
console.log(status); // => untracked: ["test-file.txt"]

// Stage all files
await repo.addAll();
status = await repo.getStatus(); // => untracked:[], added: ["test-file.txt"]

// Commit failure (author is missing)
let commitInfo = await repo.commit("First test commit").catch(() => undefined);
console.log(commitInfo); // => undefined

// Set author and try again
repo.author = new GitAuthor("John Smith", "john@somewhere.net");
commitInfo = await repo.commit("First test commit");
console.log(commitInfo); // => latest commit information is shown

// cleanup
await Deno.remove(dir, { recursive: true });

```