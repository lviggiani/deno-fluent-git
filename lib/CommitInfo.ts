export type CommitAuthor = {
    name: string,
    email?:string
}

export class CommitInfo {
    hash?: string;
    author?: CommitAuthor;
    date?: Date;
    comment?: string;


    /**
     * Parses commit info block from `git log` command outpu
     * @param log git log block
     * @returns CommitInfo structure
     */
    static parse(log:string):CommitInfo {
        const rows = log.split(/\n/);
        return {
            hash: rows[0],
            author: {
                name: (rows.find(row => row.match(/^author:/i)) || "").match(/^author:\s+([^<]+)/i)![1].trim(),
                email:((rows.find(row => row.match(/^author:/i)) || "").match(/<([^>]+)/) || [])[1]
            },
            date: new Date((rows.find(row => row.match(/^date:/i)) || "").match(/^date:\s+([^<]+)/i)![1]),
            comment: rows.slice(1).filter(row => row.trim() && !row.match(/^[a-z]+:/i)).map(r => r.trim()).join("\n")
        }
    }
}