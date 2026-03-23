CREATE OR REPLACE FUNCTION set_restaurant_slug()
RETURNS TRIGGER AS $$
DECLARE
  loc RECORD;
BEGIN
  SELECT city, addr, housenumber
  INTO loc
  FROM locations
  WHERE id = NEW.location_id;

  NEW.slug := LEFT(LOWER(
    TRIM(BOTH '-' FROM
      REGEXP_REPLACE(
        unaccent(
          CONCAT_WS('-',
            NEW.name,
            loc.city,
            loc.addr,
            loc.province
          )
        ),
        '[^a-zA-Z0-9]+',
        '-',
        'g'
      )
    )
  ), 120);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER trg_set_restaurant_slug
BEFORE INSERT OR UPDATE OF name, location_id
ON restaurants
FOR EACH ROW
EXECUTE FUNCTION set_restaurant_slug();