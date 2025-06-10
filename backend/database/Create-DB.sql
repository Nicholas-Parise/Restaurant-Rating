DROP TABLE IF EXISTS favorite_restaurant;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS popular;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS restaurant_cats;
DROP TABLE IF EXISTS menuItems;
DROP TABLE IF EXISTS restaurants;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS locations;

CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE TABLE locations (
id SERIAL PRIMARY KEY,
housenumber TEXT,       
addr TEXT,
city TEXT,
province TEXT,
country TEXT,
postalcode TEXT,
lat DOUBLE PRECISION,
lon DOUBLE PRECISION,
geom GEOMETRY(Point, 4326)
);

CREATE INDEX idx_locations_geom ON locations USING GIST ((geom::geography));

CREATE TABLE categories(
id SERIAL PRIMARY KEY,   
name TEXT,
description TEXT,
created TIMESTAMP DEFAULT NOW()
);


CREATE TABLE restaurants (
id BIGINT PRIMARY KEY,
location_id BIGINT REFERENCES locations (id),
name TEXT,
description TEXT,
pictures TEXT,
type TEXT,
cuisine TEXT,
phone TEXT,
brand TEXT,
opening_hours TEXT,
website TEXT,
wikipedia TEXT,
takeaway BOOLEAN,
internet_access BOOLEAN,
wheelchair BOOLEAN,
outdoor_seating BOOLEAN,
drive_through BOOLEAN,
air_conditioning BOOLEAN,
delivery BOOLEAN,
cash BOOLEAN,
visa BOOLEAN,
mastercard BOOLEAN,
vegetarian BOOLEAN,
updated TIMESTAMP
);

CREATE TABLE menuItems(
id SERIAL PRIMARY KEY, 
restaurant_id BIGINT REFERENCES restaurants (id),
name TEXT,
description TEXT,
price real,
pictures TEXT,
updated TIMESTAMP
);

CREATE TABLE restaurant_cats( 
restaurant_id BIGINT REFERENCES restaurants (id),
category_id INTEGER REFERENCES categories (id),
PRIMARY KEY (restaurant_id, category_id),
created TIMESTAMP DEFAULT NOW()
);


CREATE TABLE users(
id SERIAL PRIMARY KEY,
location_id INTEGER REFERENCES locations (id), 
name TEXT,
password TEXT NOT NULL,
username TEXT UNIQUE NOT NULL,
email TEXT UNIQUE NOT NULL,
picture TEXT,
bio TEXT,
pro BOOLEAN,
setup BOOLEAN,
notifications BOOLEAN,
isadmin BOOLEAN,
iscritic BOOLEAN,
isowner BOOLEAN,
google_id TEXT UNIQUE,
provider TEXT,
stripe_customer_id TEXT,
stripe_subscription_id TEXT,
subscription_status TEXT,
subscription_plan TEXT,
subscription_ends TIMESTAMP,
created TIMESTAMP DEFAULT NOW(),
updated TIMESTAMP
);

CREATE TABLE notifications(
id SERIAL PRIMARY KEY,   
user_id integer REFERENCES users(id) ON DELETE CASCADE,
title TEXT,
body TEXT,
url TEXT,
is_read BOOLEAN,
created TIMESTAMP DEFAULT NOW()
);

CREATE TABLE popular(
id SERIAL PRIMARY KEY,   
restaurant_id BIGINT REFERENCES restaurants (id) ,
created TIMESTAMP DEFAULT NOW()
);

CREATE TABLE sessions(  
user_id integer REFERENCES users(id),
token TEXT UNIQUE,
PRIMARY KEY(user_id, token),
created TIMESTAMP DEFAULT NOW()
);


CREATE TABLE reviews(
id SERIAL PRIMARY KEY, 
restaurant_id BIGINT REFERENCES restaurants(id),
user_id BIGINT REFERENCES users(id),
liked BOOLEAN,
visited BOOLEAN,
desired BOOLEAN,
score INT,
description TEXT,
updated TIMESTAMP,
created TIMESTAMP DEFAULT NOW()
);

CREATE TABLE favorite_restaurant(
restaurant_id BIGINT REFERENCES restaurants(id),
user_id BIGINT REFERENCES users(id),
created TIMESTAMP DEFAULT NOW(),
PRIMARY KEY(restaurant_id, user_id)
);


