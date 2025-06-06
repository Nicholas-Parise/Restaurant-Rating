const express = require('express');
const db = require('./db');
const router = express.Router();

let restaurantEntry = [
  {id:0, name:'Nonnas kitchen', description:'description', date:'April 20 2024',pictures:['assets/placeholder-restaurant.png','picture2']},
  {id:1, name:'mcdonalds', description:'description', date:'April 18 2024', pictures:['assets/placeholder-restaurant.png','picture2']}
];


// amount = fast 0 or full 1
// localhost:3000/restaurants?page=1&pageSize=10?amount=0
router.get('/', async (req, res,next) => {

  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;
  const amount = parseInt(req.query.amount) || 1;
  const offset = (page - 1) * pageSize;
  var result;

 
  try {
    if(amount == 1){
      result = await db.query('SELECT * FROM restaurants LIMIT $1 OFFSET $2',[pageSize,offset]);
    }else{
      result = await db.query('SELECT id,name,subclass FROM restaurants LIMIT $1 OFFSET $2',[pageSize,offset]);
    }


    const paginatedRestaurants =  result.rows; //result.rows.slice((page - 1) * pageSize, page * pageSize);

    res.json({
      page,
      pageSize,
      totalRestaurants: result.rows.length,
      restaurants: paginatedRestaurants,
    });


  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});



// localhost:3000/restaurants?page=1&pageSize=10
router.get('/:restaurantId', async (req, res,next) => {

  const restaurantId = parseInt(req.params.restaurantId);
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;
  
  
  try {
    const result = await db.query(`SELECT * FROM restaurants WHERE id = $1`,[restaurantId]);
    const restaurantFromServer =  result.rows[0];

    const reviewResult = await db.query('SELECT * FROM reviews WHERE restaurant_id = $1 AND visited = TRUE LIMIT 20',[restaurantId]);
    const reviews =  reviewResult.rows;

    res.json({
      restaurants: restaurantFromServer,
      reviews: reviews
    });


  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
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