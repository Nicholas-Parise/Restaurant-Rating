BEGIN;
UPDATE temp_locations
SET 
    lon = ST_X(ST_Transform(geom, 4326)),
    lat = ST_Y(ST_Transform(geom, 4326));
COMMIT;

BEGIN;
INSERT INTO locations (addr, city, province, country, postalcode, lat, lon)
SELECT addr, city, province, country, postalcode, lat, lon
FROM temp_locations;
COMMIT;


BEGIN;
UPDATE temp_restaurants AS tr
SET location_id = l.id
FROM locations AS l
JOIN temp_locations AS tl
  ON tl.lat = l.lat
  AND tl.lon = l.lon
WHERE tr.id = tl.id;  -- Match temp_restaurants.id with temp_locations.id
COMMIT;

table temp_restaurants;
table temp_locations;
table locations;

BEGIN;
INSERT INTO restaurants (id, location_id, name, lastupdated, type, cuisine, phone, brand, opening_hours, website, wikipedia, takeaway, internet_access, wheelchair, outdoor_seating, drive_through, air_conditioning, delivery, cash, visa, mastercard, vegetarian)
SELECT 
temp_restaurants.id,
temp_restaurants.location_id,
temp_restaurants.name,
CURRENT_TIMESTAMP,
temp_restaurants.type,
temp_restaurants.cuisine,
temp_restaurants.phone,
temp_restaurants.brand,
temp_restaurants.opening_hours,
temp_restaurants.website,
temp_restaurants.wikipedia,
temp_restaurants.takeaway,
temp_restaurants.internet_access,
temp_restaurants.wheelchair,
temp_restaurants.outdoor_seating,
temp_restaurants.drive_through,
temp_restaurants.air_conditioning,
temp_restaurants.delivery,
temp_restaurants.cash,
temp_restaurants.visa,
temp_restaurants.mastercard,
temp_restaurants.vegetarian
FROM temp_restaurants
WHERE temp_restaurants.name IS NOT NULL;
COMMIT;


--drop table temp_restaurants;
--drop table temp_locations;
