const express = require('express');
const bodyParser = require('body-parser');


import authRoutes from'./routes/auth';

import userRoutes from'./routes/users';
import friendRoutes from'./routes/friends';

import restaurantRoutes from './routes/restaurant';
import reviewRoutes from'./routes/reviews';
import listRoutes from './routes/lists';
import notificationRoutes from './routes/notifications';
import bookmarkRoutes from './routes/bookmarks';
import favouriteRoutes from './routes/favourites';

import reportRoutes from './routes/reports'
import contactRoutes from './routes/contacts'

import sitemap from './routes/sitemap';
import webhooks from './routes/webhooks'

const responseFormatter = require('./middleware/responseFormatter');
const cookieParser = require("cookie-parser");

const cors = require('cors');
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());

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
  origin: [
    'http://localhost:4200',
    'http://local.deglazd.com:4200',
    'https://www.deglazd.com',
    'https://deglazd.com'
  ],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Authorization'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

app.use(responseFormatter);

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
app.use('/reports',reportRoutes);
app.use('/contacts',contactRoutes);

app.use('/uploads', express.static('uploads'));

app.use('/sitemap.xml',sitemap);
app.use('/webhooks',webhooks);


app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

module.exports = app;