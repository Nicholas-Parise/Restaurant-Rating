export class UserEntry{
    constructor(public id:number, 
        public name: string | null, 
        public username: string, 
        public picture: string, 
        public bio: string, 
        public isOwner: boolean, 
        public isCritic: boolean){}
}
    