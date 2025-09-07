export class ListEntry{
    constructor(
        public id:number, 
        public user_id:number, 
        public name: string,
        public description:string|null,
        public updated: Date,
        public created: Date,
        public owner_name: string,
        public owner_username: string
        ){}
}