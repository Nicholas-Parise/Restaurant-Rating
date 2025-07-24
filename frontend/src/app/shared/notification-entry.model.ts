export class NotificationEntry{
    constructor(public id:number, 
        public title: string | null,
        public body: string, 
        public url: string, 
        public is_read: boolean,
        public created: Date,
        ){}
}
    