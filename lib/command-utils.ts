/**
 * Deno.Command helper class
 */
export class CmdOutput {
    private output: Deno.CommandOutput;

    constructor(output:Deno.CommandOutput){
        this.output = output;
    }

    /**
     * Read StdOut
     * @returns StdOut as text (string)
     */
    text():string{
        return this.output.success ? new TextDecoder().decode(this.output.stdout) : "";
    }

    get success():boolean {
        return this.output.success;
    }

    /**
     * Read StdErr
     * @returns StdErr as text (string)
     */
    get error():string {
        return new TextDecoder().decode(this.output.stderr);
    }
}


/**
 * 
 * @param command command to be executed
 * @param args args to be passed
 * @param cwd working directory where the comment will be executerd
 * @returns a CmdOutput object to help retrieving results
 */
export async function cmd(command:string, args?:string[], cwd?:string):Promise<CmdOutput|undefined> {
    const options = { args, cwd }
    const dcommand = new Deno.Command(command, options);

    try {
        return new CmdOutput(await dcommand.output());
    } catch (_){
        return Promise.reject();
    }
}