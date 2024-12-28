const express = require('express');
const bodyParser = require('body-parser');
const reviewRoutes = require('./reviews');
const restaurantRoutes = require('./restaurant');

const app = express();


// Middleware
app.use(bodyParser.json());

// CORS HEADERS
app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Headers','Origin, Content-Type, X-Requested-With, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
})

// Routes
app.use('/reviews', reviewRoutes);
app.use('/restaurant', restaurantRoutes);


module.exports = app;