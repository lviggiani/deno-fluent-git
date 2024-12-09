export class GitAuthor {

    #username?: string;
    #email?: string;

    /**
     * Creates a GitAuthor and check for name and email validity
     * @param username user name (e.g John Smith)
     * @param email a valued email address
     */
    constructor(username:string, email:string){
        this.username = username;
        this.email = email;
    }

    /**
     * 
     * @returns a string representing the author as 'username <email>' (e.g. "John Smith <john@somewhere.net>")
     */
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