export class UserEntry{
    constructor(public id:number, 
        public name: string | null,
        public email: string, 
        public username: string, 
        public picture: string, 
        public bio: string,
        public notifications: boolean, 
        public isOwner: boolean, 
        public isCritic: boolean
        ){}
}
    