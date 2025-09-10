const express = require('express');
const bodyParser = require('body-parser');

const reviewRoutes = require('./routes/reviews');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const friendRoutes = require('./routes/friends');

import restaurantRoutes from './routes/restaurant';
import listRoutes from './routes/lists';
import notificationRoutes from './routes/notifications';
import bookmarkRoutes from './routes/bookmarks';
import favouriteRoutes from './routes/favourites';

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
app.use('/lists',listRoutes);


module.exports = app;