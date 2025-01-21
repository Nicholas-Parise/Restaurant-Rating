drop table restaurants;
drop table locations;

SELECT * FROM restaurants LIMIT 10 OFFSET 10;

SELECT * FROM restaurants;

SELECT COUNT(*) FROM restaurants WHERE id is null;

SELECT * FROM restaurants WHERE id = 21631698;

Select restaurants.*,locations.* from restaurants JOIN locations ON restaurants.id = locations.id WHERE restaurants.name = 'Westway Family Restaurant';

select distinct on (osm_type) osm_type from restaurants;


BEGIN;
UPDATE locations
SET 
    lon = ST_X(ST_Transform(geom, 4326)),
    lat = ST_Y(ST_Transform(geom, 4326));
COMMIT;