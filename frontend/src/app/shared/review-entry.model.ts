export class ReviewEntry{
    constructor(
        public id:number, 
        public restaurant_id: number,
        public description: string, 
        public liked: boolean, 
        public visited: boolean, 
        public score: number, 
        public username:string,
        public name:string,
        public updated: Date,
        public created: Date,
        public pictures : string,
        public restaurant_name: string){}
}