const express = require('express');
const router = express.Router();

let restaurantEntry = [
  {id:0, name:'Nonnas kitchen', description:'description', date:'April 20 2024',pictures:['assets/placeholder-restaurant.png','picture2']},
  {id:1, name:'mcdonalds', description:'description', date:'April 18 2024', pictures:['assets/placeholder-restaurant.png','picture2']}
];


// localhost:3000/restaurants?page=1&pageSize=10
router.get('/',(req,res,next)=>{
    
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    
    const paginatedRestaurants = restaurantEntry.slice((page - 1) * pageSize, page * pageSize);

    res.json({
        page,
        pageSize,
        totalRestaurants: restaurantEntry.length,
        restaurants: paginatedRestaurants,
      });
})

// localhost:3000/restaurants/0
router.get('/:restaurantId', (req, res, next) => {
    const restaurantId = parseInt(req.params.restaurantId);
  
    const allReviews = restaurantEntry.filter(restaurants => restaurants.id === restaurantId);
    
    res.json({
      restaurants: allReviews,
    });
  });


  router.post('/add', (req, res) => {

    restaurantEntry.push({id: req.body.id, 
      name: req.body.name,
      description: req.body.description,
      date: req.body.date, 
      pictures: req.body.pictures,
      username: req.body.username});
    
    res.status(200).json({
        message: 'Post submitted'
    });
  });


  module.exports = router;