/*
export class RestaurantEntry{
    constructor(public id:number, public name: string, public description: string,public date: string,public pictures: string[]){}
}
*/
export class RestaurantEntry{
    constructor(
        public id : number,
        public location_id : number,
        public name : string,
        public description : string,
        public pictures : string,
        public type : string,
        public cuisine : string,
        public phone : string,
        public brand : string,
        public opening_hours : string,
        public website : string,
        public wikipedia : string,
        public takeaway : boolean,
        public internet_access : boolean,
        public wheelchair : boolean,
        public outdoor_seating : boolean,
        public drive_through : boolean,
        public air_conditioning : boolean,
        public delivery : boolean,
        public cash : boolean,
        public visa : boolean,
        public mastercard : boolean,
        public vegetarian : boolean,
        
        public smoking : boolean,
        public toilets : boolean,
        public breakfast : boolean,
        public lunch : boolean,
        public dinner : boolean,
        public facebook : string,
        public indoor_seating : boolean,
        public updated : string,

        public score_histogram: string,

        public housenumber: string,
        public addr : string,
        public city : string,
        public province : string,
        public country : string){}
}