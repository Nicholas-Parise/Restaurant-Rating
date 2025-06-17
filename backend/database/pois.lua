
local restaurant = osm2pgsql.define_table({
    name = 'temp_restaurants',
    ids = { type = 'any', type_column = 'osm_type', id_column = 'id' },
    columns = {
       -- Auto-incrementing ID  { column = 'id', sql_type = 'serial', not_null = true, primary_key = true }, -- Auto-incrementing ID
       { column = 'location_id' , type = 'BIGINT'}, 
       { column = 'name' , type = 'text'},
        { column = 'type', type = 'text' },
        { column = 'cuisine', type = 'text' },
        { column = 'phone', type = 'text' },
        { column = 'brand', type = 'text' },
        { column = 'opening_hours', type = 'text' },
        { column = 'website', type = 'text' },
        { column = 'wikipedia', type = 'text' },

        { column = 'takeaway', type = 'boolean' },
        { column = 'internet_access', type = 'boolean' },
        { column = 'wheelchair', type = 'boolean' },
        { column = 'outdoor_seating', type = 'boolean' },
        { column = 'drive_through', type = 'boolean' },
        { column = 'air_conditioning', type = 'boolean' },
        { column = 'delivery', type = 'boolean' },
        { column = 'cash', type = 'boolean' },
        { column = 'visa', type = 'boolean' },
        { column = 'mastercard', type = 'boolean' },
        { column = 'vegetarian', type = 'boolean' },
 	{ column = 'smoking', type = 'boolean' },
 	{ column = 'toilets', type = 'boolean' },
	{ column = 'breakfast', type = 'boolean' },
	{ column = 'lunch', type = 'boolean' },
	{ column = 'dinner', type = 'boolean' },
  	{ column = 'image', type = 'text' },
	{ column = 'menu', type = 'text' },
        { column = 'tags', type = 'jsonb' }
    },
        if_exists = 'append',
    })


local locations = osm2pgsql.define_table({
    name = 'temp_locations',
    ids = { type = 'any', type_column = 'osm_type', id_column = 'id' },
    columns = {
       
        { column = 'housenumber', type = 'text' },
        { column = 'addr', type = 'text' },
        { column = 'city', type = 'text' },
        { column = 'province', type = 'text' },
        { column = 'country', type = 'text' },
        { column = 'postalcode', type = 'text' },
        
        { column = 'geom', type = 'point', not_null = true },
        { column = 'lat', type = 'real' },
        { column = 'lon', type = 'real' }
    }, 
    if_exists = 'append',
})


local false_values = {
    no = true,
    ["no"] = true,
    ["false"] = true,
    ["null"] = true,
    ["bad"] = true
}

local function set_boolean_field(value)
    -- Check if value exists in the false_values table
    return not (value == nil or false_values[value:lower()])
end

function process_poi(object, geom)

    if object.tags.amenity and 
    object.tags.amenity == "bar" or 
    object.tags.amenity == "biergarten" or 
    object.tags.amenity == "cafe" or 
    object.tags.amenity == "fast_food" or 
    object.tags.amenity == "food_court" or 
    object.tags.amenity == "ice_cream" or 
    object.tags.amenity == "pub" or 
    object.tags.amenity == "restaurant" then
       
        local location_data  = {
            geom = geom,
            country = object.tags["addr:country"],
            addr = object.tags["addr:street"],
            city = object.tags["addr:city"],
            province = object.tags["addr:province"] or object.tags["addr:state"],
            postcode = object.tags["addr:postcode"],
            housenumber = object.tags["addr:housenumber"],
            lon = nil,
            lat = nil
        }
       
        local restaurant_data  = {
            name = object.tags.name,
            type = object.tags.amenity,
            brand = object.tags.brand,
            cuisine = object.tags.cuisine,
            phone = object.tags.phone or object.tags["contact:phone"],
            opening_hours = object.tags.opening_hours,
            website = object.tags.website or object.tags["contact:website"],
            wikipedia = object.tags["brand:wikipedia"],

            takeaway = set_boolean_field(object.tags.takeaway),
            internet_access = set_boolean_field(object.tags.internet_access),
            wheelchair = set_boolean_field(object.tags.wheelchair),
            outdoor_seating = set_boolean_field(object.tags.outdoor_seating),
            drive_through = set_boolean_field(object.tags.drive_through),
            air_conditioning = set_boolean_field(object.tags.air_conditioning),
            delivery = set_boolean_field(object.tags.delivery),
            cash = set_boolean_field(object.tags["payment:cash"]),
            visa = set_boolean_field(object.tags["payment:visa"]),
            mastercard = set_boolean_field(object.tags["payment:mastercard"]),
            vegetarian = set_boolean_field(object.tags["diet:vegan"] or object.tags["diet:vegetarian"]),
	    smoking = set_boolean_field(object.tags.smoking),
	    toilets = set_boolean_field(object.tags.toilets or object.tags["toilets:access"]),
	    breakfast = set_boolean_field(object.tags.breakfast),
	    lunch = set_boolean_field(object.tags.lunch),
	    dinner = set_boolean_field(object.tags.dinner),
	    image = object.tags.image or object.tags.wikimedia_commons,
	    menu = object.tags["website:menu"],
            tags = object.tags
        }

        locations:insert(location_data)
        restaurant:insert(restaurant_data)

    end
end

function osm2pgsql.process_node(object)
    process_poi(object, object:as_point())
end

function osm2pgsql.process_way(object)
    if object.is_closed and object.tags.building then
        process_poi(object, object:as_polygon():centroid())
    end
end

