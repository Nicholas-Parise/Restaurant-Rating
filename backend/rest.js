const express = require('express');
const bodyParser = require('body-parser');

const reviewRoutes = require('./reviews');
const restaurantRoutes = require('./restaurant');
const authRoutes = require('./auth');
const userRoutes = require('./users');
const notificationRoutes = require('./notifications');
const friendRoutes = require('./friends');
const bookmarkRoutes = require('./bookmarks');
const favouriteRoutes = require('./favourites');

const cors = require('cors');
const app = express();

// Middleware
app.use(bodyParser.json());

/*
// CORS HEADERS
app.use((req,res,next)=>{
     res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Headers','*');
    //res.setHeader('Access-Control-Allow-Headers','Origin, Content-Type, X-Requested-With, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
})
*/

app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Authorization'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));


// Routes
app.use('/reviews', reviewRoutes);
app.use('/restaurants', restaurantRoutes);
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/notifications',notificationRoutes);
app.use('/friends',friendRoutes);
app.use('/bookmarks',bookmarkRoutes);
app.use('/favourites',favouriteRoutes);

module.exports = app;