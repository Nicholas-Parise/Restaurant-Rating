BEGIN;
UPDATE pois
SET 
    lon = ST_X(ST_Transform(geom, 4326)),
    lat = ST_Y(ST_Transform(geom, 4326));
COMMIT;