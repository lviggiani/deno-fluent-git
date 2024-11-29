export class CmdOutput {
    private output: Deno.CommandOutput;

    constructor(output:Deno.CommandOutput){
        this.output = output;
    }

    text():string{
        return this.output.success ? new TextDecoder().decode(this.output.stdout) : "";
    }

    get success():boolean {
        return this.output.success;
    }

    get error():string {
        return new TextDecoder().decode(this.output.stderr);
    }
}

export async function cmd(command:string, args?:string[], cwd?:string):Promise<CmdOutput|undefined> {
    const options = { args, cwd }
    const dcommand = new Deno.Command(command, options);

    try {
        return new CmdOutput(await dcommand.output());
    } catch (_){
        return Promise.reject();
    }
}