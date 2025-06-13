export class UserEntry{
    constructor(public id:number, 
        public name: string | null, 
        public username: string, 
        public picture: string, 
        public description: string, 
        public isOwner: boolean, 
        public isCritic: boolean){}
}
    