/*
export class RestaurantEntry{
    constructor(public id:number, public name: string, public description: string,public date: string,public pictures: string[]){}
}
*/
export class RestaurantEntry{
    constructor( public osm_type : string,
        public id : number,
        public name : string,
        public subclass : string,
        public cuisine : string,
        public phone : string,
        public brand : string,
        public opening_hours : string,
        public website : string,
        public wikipedia : string,
        public takeaway : string,
        public internet_access : string,
        public wheelchair : string,
        public  outdoor_seating : string,
        public drive_through : string,
        public air_conditioning : string,
        public delivery : string,
        public cash : string,
        public visa : string,
        public mastercard : string,
        public vegetarian : string,
        public pictures: string[],
        public description: string,
        public date: string){}
}

/*
CREATE TABLE restaurant (
    public osm_type : string,
    public id number,
    public name : string,
    public subclass : string,
    public cuisine : string,
    public phone : string,
    public brand : string,
    public opening_hours : string,
    public website : string,
    public wikipedia : string,
    public takeaway : string,
    public internet_access : string,
    public wheelchair : string,
    public  outdoor_seating : string,
    public drive_through : string,
    public air_conditioning : string,
    public delivery : string,
    public cash : string,
    public visa : string,
    public mastercard : string,
    public vegetarian : string
);

*/