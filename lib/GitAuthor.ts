export class GitAuthor {

    #username?: string;
    #email?: string;

    constructor(username:string, email:string){
        this.username = username;
        this.email = email;
    }

    toString():string {
        return `${this.#username} <${this.#email}>`;
    }

    get username():string {
        return this.#username!;
    }

    set username(value:string){
        value = value.trim();
        if (value == "") throw "Invalid username";

        this.#username = value;
    }

    get email():string {
        return this.#email!;
    }

    set email(value:string){
        if (!value?.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/))
            throw "Invalid email";

        this.#email = value;
    }
}