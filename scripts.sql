drop table restaurants;
drop table locations;

table restaurants;
table locations;

SELECT * FROM restaurants LIMIT 10 OFFSET 10;

SELECT id,name,subclass FROM restaurants LIMIT 10 OFFSET 10;

SELECT * FROM restaurants;

SELECT COUNT(*) FROM restaurants WHERE id is null;


SELECT * FROM restaurants WHERE name is null;

SELECT * FROM temp_restaurants WHERE name is null;


Select restaurants.*,locations.* from restaurants JOIN locations ON restaurants.location_id = locations.id;

select distinct on (osm_type) osm_type from restaurants;

delete FROM restaurants where restaurants.name = null;

BEGIN;
UPDATE locations
SET 
    lon = ST_X(ST_Transform(geom, 4326)),
    lat = ST_Y(ST_Transform(geom, 4326));
COMMIT;