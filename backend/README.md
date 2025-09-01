# Backend

# Endpoints
An end point in **BOLD** specifies it's implemented.

## Authentication
**POST /auth/register → Create a new user  
POST /auth/login → Authenticate a user and generate a session token  
POST /auth/logout → Invalidate the session token  
GET /auth/me → get logged in user info  
POST /auth/forgot-password → send an email with recovery code  
POST /auth/reset-password → reset password with one time code  
GET /auth/google → start oauth process  
GET /auth/google/callback → finish oauth process**

## Categories
**GET /categories → Get all categories   
GET /categories/:id → Get category details  
POST /categories → Create a new category**  


## restaurant
**GET /     → get a collection of restaurants  
GET /search → search for restaurants given a query, and/or position data  
GET /:id    → get restaurant by specific ID**


## reviews
**GET /         → get logged in users reviews  
GET /:username  → get reviews from specific user  
GET /restaurants/:restaurantId → get reviews from a restaurant  
POST / → create a new review for a given restaurant**

## Notifications
**GET /notifications → Get all notifications from logged in user  
PUT /notifications/:id → Edit a notifications (ex: is_read)   
DELETE /notifications/:id → Delete a notifications**  


## Payments
GET /payments/subscription → Get current users subscription status  
POST /payments/create-subscription-session → Get link to launch a checkout page  
POST /payments/create-portal-session → Get link to launch a manage subscription page  
POST /payments/reactivate-subscription → Reactivate subscription renewal  
POST /payments/cancel-subscription → Deactivate subscription renewal  
POST /payments/webhook → Performs actions depending on what stripe sends

## Status
GET /status → Get API status

## users
**GET / → Get logged in user profile and categories   
PUT / → Update logged in user profile  
DELETE / → Delete logged in user account  
GET /:id → Get specific user profile  
POST /upload → upload a profile picture  
GET /search → search for users given a query**

## favourites
**GET /favourites → get all favourited restaurants  
GET /favourites/:restaurant_id' → Add a favourites restaurant to logged in user  
DELETE /favourites/:restaurant_id → remove a favourites restaurant from logged in user**

## bookmarks
**GET / → get all bookmarked restaurants
GET /:username → get all bookmarked restaurants from provided user   
POST /:restaurant_id' → Add a bookmark restaurant to logged in user  
DELETE /:restaurant_id → remove a bookmarked restaurant from logged in user**

## friends
**GET / → get all friends of logged in user  
GET /:username → get all friends of specific user by username  
POST /:username → Add a friendship request from logged in user to provided user  
POST /:username/accept → Accept a friendship request from provided user  
POST /:username/deny → Deny a friendship request from provided user  
DELETE /:username → Remove a friend (provided user)**

# Server Architecture
![Screenshot of Server Architecture.](server-architecture.png)


# Database
![Screenshot of database UML.](database/DATABASE-UML.png)


