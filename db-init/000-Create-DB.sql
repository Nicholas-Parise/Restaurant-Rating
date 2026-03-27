/*
DROP TABLE IF EXISTS reports;
DROP TABLE IF EXISTS listed_restaurants;
DROP TABLE IF EXISTS lists;
DROP TABLE IF EXISTS bookmarked_restaurant;
DROP TABLE IF EXISTS favorite_restaurant;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS popular;
DROP TABLE IF EXISTS friends;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS restaurant_cats;
DROP TABLE IF EXISTS menuItems;
DROP TABLE IF EXISTS restaurants;
DROP TABLE IF EXISTS category_aliases;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS locations;
*/
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS unaccent;

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
geom GEOMETRY(Point, 4326),
geocode_attempted BOOLEAN DEFAULT FALSE,
updated TIMESTAMP
);

CREATE INDEX idx_locations_geom ON locations USING GIST ((geom::geography));

CREATE TABLE categories(
id SERIAL PRIMARY KEY,   
name TEXT UNIQUE NOT NULL,
description TEXT,
created TIMESTAMP DEFAULT NOW()
);

CREATE TABLE category_aliases (
alias TEXT PRIMARY KEY,
canonical_category_id INT REFERENCES categories(id) ON DELETE CASCADE
);


CREATE TABLE restaurants (
id BIGINT PRIMARY KEY,
location_id BIGINT NOT NULL REFERENCES locations (id),
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
smoking BOOLEAN,
toilets BOOLEAN,
breakfast BOOLEAN,
lunch BOOLEAN,
dinner BOOLEAN,
facebook TEXT,
instagram TEXT,
twitter TEXT,
indoor_seating BOOLEAN,
slug TEXT,
updated TIMESTAMP,
created TIMESTAMP DEFAULT NOW(),
score_histogram JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX restaurants_name_trgm_idx ON restaurants USING GIN (name gin_trgm_ops);
CREATE INDEX restaurants_location_users ON restaurants(location_id);
CREATE INDEX idx_restaurants_slug ON restaurants(slug);

CREATE TABLE menuItems(
id SERIAL PRIMARY KEY, 
restaurant_id BIGINT REFERENCES restaurants (id) ON DELETE CASCADE,
name TEXT,
description TEXT,
price real,
pictures TEXT,
updated TIMESTAMP
);

CREATE TABLE popular(
id SERIAL PRIMARY KEY,   
restaurant_id BIGINT REFERENCES restaurants (id),
priority INT,
created TIMESTAMP DEFAULT NOW()
);

CREATE TABLE restaurant_cats( 
restaurant_id BIGINT NOT NULL REFERENCES restaurants (id) ON DELETE CASCADE,
category_id INTEGER NOT NULL REFERENCES categories (id) ON DELETE CASCADE,
PRIMARY KEY (restaurant_id, category_id),
created TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_restaurantcats_restaurant ON restaurant_cats(restaurant_id);
CREATE INDEX idx_restaurantcats_category ON restaurant_cats(category_id);


CREATE TABLE users(
id SERIAL PRIMARY KEY,
location_id INTEGER REFERENCES locations (id), 
username TEXT UNIQUE NOT NULL,
email TEXT UNIQUE NOT NULL,
password TEXT NOT NULL,
name TEXT,
picture TEXT,
bio TEXT,
pro BOOLEAN,
setup BOOLEAN,
notifications BOOLEAN,
permissions TEXT CHECK (permissions IN ('banned','user', 'moderator', 'admin')) DEFAULT 'user',
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

CREATE INDEX idx_users_username ON users(username);
CREATE INDEX users_name_trgm_idx ON users USING GIN (name gin_trgm_ops);
CREATE INDEX users_username_trgm_idx ON users USING GIN (username gin_trgm_ops);

CREATE TABLE friends(  
user_id integer NOT NULL REFERENCES users(id) ON DELETE CASCADE,
friend_id integer NOT NULL REFERENCES users(id) ON DELETE CASCADE,
status TEXT CHECK (status IN ('pending', 'accepted', 'declined')) DEFAULT 'pending',
created TIMESTAMP DEFAULT NOW(),
updated TIMESTAMP,
PRIMARY KEY(user_id, friend_id)
);

CREATE INDEX idx_friends_status_requester ON friends(status, user_id);
CREATE INDEX idx_friends_status_addressee ON friends(status, friend_id);


CREATE TABLE notifications(
id SERIAL PRIMARY KEY,   
user_id integer NOT NULL REFERENCES users(id) ON DELETE CASCADE,
title TEXT,
body TEXT,
url TEXT,
is_read BOOLEAN,
created TIMESTAMP DEFAULT NOW()
);


CREATE TABLE sessions(  
user_id integer NOT NULL REFERENCES users(id) ON DELETE CASCADE,
token TEXT UNIQUE,
PRIMARY KEY(user_id, token),
created TIMESTAMP DEFAULT NOW()
);


CREATE TABLE reviews(
id SERIAL PRIMARY KEY, 
restaurant_id BIGINT NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
liked BOOLEAN,
visited BOOLEAN,
score INT,
description TEXT,
updated TIMESTAMP,
created TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_reviews_users ON reviews(user_id);
CREATE INDEX idx_reviews_restaurant ON reviews(restaurant_id);


CREATE TABLE favorite_restaurant(
restaurant_id BIGINT NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
sequence INT,
created TIMESTAMP DEFAULT NOW(),
PRIMARY KEY(restaurant_id, user_id)
);

CREATE TABLE bookmarked_restaurant(
restaurant_id BIGINT NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
created TIMESTAMP DEFAULT NOW(),
PRIMARY KEY(restaurant_id, user_id)
);


CREATE TABLE lists(
id SERIAL PRIMARY KEY,
user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE, 
name TEXT NOT NULL,
description TEXT,
updated TIMESTAMP,
created TIMESTAMP DEFAULT NOW()
);
CREATE INDEX lists_name_trgm_idx ON lists USING GIN (name gin_trgm_ops);

CREATE TABLE listed_restaurants(
restaurant_id BIGINT NOT NULL REFERENCES restaurants(id),
list_id BIGINT NOT NULL REFERENCES lists(id) ON DELETE CASCADE,
priority INT,
created TIMESTAMP DEFAULT NOW(),
PRIMARY KEY(restaurant_id, list_id)
);


CREATE TABLE reports (
    id SERIAL PRIMARY KEY,

    reporter_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    target_type TEXT NOT NULL CHECK (target_type IN ('review', 'user', 'list')),
    target_id BIGINT NOT NULL,
    UNIQUE (reporter_id, target_type, target_id),

    reason TEXT NOT NULL CHECK (reason IN (
        'spam',
        'harassment',
        'hate',
        'nudity',
        'violence',
        'misinformation',
        'other'
    )),

    description TEXT,

    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
        'pending',
        'reviewed',
        'resolved',
        'dismissed'
    )),

    reviewed_by BIGINT REFERENCES users(id),
    reviewed_at TIMESTAMP,
    created TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_reports_target ON reports(target_type, target_id);
CREATE INDEX idx_reports_status ON reports(status);