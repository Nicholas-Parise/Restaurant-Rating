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
id SERIAL PRIMARY KEY,   
restaurant_id BIGINT REFERENCES restaurants (id),
category_id INTEGER REFERENCES categories (id),
created TIMESTAMP DEFAULT NOW()
);

CREATE TABLE users(
id SERIAL PRIMARY KEY,
location_id INTEGER REFERENCES locations (id), 
username TEXT UNIQUE NOT NULL,
password TEXT NOT NULL,
email TEXT,
picture TEXT,
bio TEXT,
notifications BOOLEAN,
isadmin BOOLEAN,
iscritic BOOLEAN,
isowner BOOLEAN,
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
id SERIAL PRIMARY KEY,   
user_id integer REFERENCES users(id),
token TEXT UNIQUE,
created TIMESTAMP DEFAULT NOW()
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
updated TIMESTAMP,
created TIMESTAMP DEFAULT NOW()
);
