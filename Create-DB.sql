DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS popular;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS restaurant_cats;
DROP TABLE IF EXISTS menuItems;
DROP TABLE IF EXISTS restaurants;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS locations;

CREATE TABLE locations (
id SERIAL PRIMARY KEY,       
addr TEXT,
city TEXT,
province TEXT,
country TEXT,
postalcode TEXT,
lat REAL,
lon REAL
);

CREATE TABLE categories(
id SERIAL PRIMARY KEY,   
name TEXT,
description TEXT,
created TIMESTAMP
);


CREATE TABLE restaurants (
id BIGINT PRIMARY KEY,
location_id BIGINT REFERENCES locations (id),
name TEXT,
description TEXT,
pictures TEXT,
lastupdated TIMESTAMP,
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
vegetarian BOOLEAN
);

CREATE TABLE menuItems(
id SERIAL PRIMARY KEY, 
restaurant_id BIGINT REFERENCES restaurants (id),
name TEXT,
description TEXT,
lastupdated TIMESTAMP,
price real,
pictures TEXT
);

CREATE TABLE restaurant_cats(
id SERIAL PRIMARY KEY,   
restaurant_id BIGINT REFERENCES restaurants (id),
category_id INTEGER REFERENCES categories (id),
created TIMESTAMP
);

CREATE TABLE users(
id SERIAL PRIMARY KEY,
location_id INTEGER REFERENCES locations (id), 
username TEXT UNIQUE NOT NULL,
password TEXT NOT NULL,
email TEXT,
datecreated TIMESTAMP,
dateupdated TIMESTAMP,
isadmin BOOL,
iscritic BOOL,
isowner BOOL
);


CREATE TABLE popular(
id SERIAL PRIMARY KEY,   
restaurant_id BIGINT REFERENCES restaurants (id) ,
created TIMESTAMP
);

CREATE TABLE sessions(
id SERIAL PRIMARY KEY,   
user_id integer REFERENCES users(id),
token TEXT UNIQUE,
created TIMESTAMP
);


CREATE TABLE reviews(
id SERIAL PRIMARY KEY, 
restaurant_id BIGINT REFERENCES restaurants(id),
user_id BIGINT REFERENCES users(id),
favorited BOOLEAN,
visited BOOLEAN,
desired BOOLEAN,
score INT,
description TEXT,
dateUpdated TIMESTAMP,
dateCreated TIMESTAMP
);
