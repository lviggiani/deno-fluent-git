export type GitStatus = {
    changed: string[],
    removed: string[],
    untracked: string[]
}