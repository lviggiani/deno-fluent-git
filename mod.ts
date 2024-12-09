/**
 * This module contains Classes and Types to interact with exisitng local git
 * repositories or create new ones.
 * @module
 */

/** Commit information */
export * from "./lib/CommitInfo.ts";

/** Git Author class with username and email validation */
export * from "./lib/GitAuthor.ts";

/** Git status information incliding added, changed, removed and untracked file list */
export * from "./lib/GitStaus.ts";

/** Repo class to interact with existing or created local git repositories */
export * from "./lib/Repo.ts";