const express = require('express');
const db = require('./db');
const router = express.Router();

let reviewEntry = [
    {id:0, review:'This place is horrible',favourited:false,visited:true,score:1,username:'treasureHound'},
    {id:1, review:'Love ths PLACE!!!!', favourited:true, visited:true,score:10,username:'admin'},
    {id:2, review:'eh its mid', favourited:false, visited:true,score:5,username:'nickpar03'},
    {id:3, review:'been going here since I was a kid and its still bad', favourited:false, visited:true, score:3,username:'jesus'}
]

// localhost:3000/reviews?page=1&pageSize=10?username=admin
router.get('/',(req,res,next)=>{
    //res.send('hello from express');
    
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const username = req.query.username || "";

    const paginatedReviews = reviewEntry.slice((page - 1) * pageSize, page * pageSize);

    res.json({
        page,
        pageSize,
        totalReviews: reviewEntry.length,
        reviews: paginatedReviews,
      });
})

// localhost:3000/reviews/restaurants/0?page=1&pageSize=10
router.get('/restaurants/:restaurantId', async (req, res, next) => {
    const restaurantId = parseInt(req.params.restaurantId);
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
  
 try {
    const result = await db.query('SELECT * FROM reviews WHERE restaurant_id = $1 LIMIT $2 OFFSET $3',[restaurantId,pageSize,offset]);
    const allReviews = 10; //await db.query('SELECT * FROM reviews WHERE restaurant_id = $1 LIMIT $2 OFFSET $3',[restaurantId,pageSize,offset]);
    const reviewsFromServer =  result.rows;

    res.json({
      page,
      pageSize,
      totalReviews: allReviews.length,
      reviews: reviewsFromServer,
    });


  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
  });


  router.post('/add', (req, res) => {

    reviewEntry.push({id: req.body.id, 
        review: req.body.review,
        favourited: req.body.favourited,
        visited: req.body.visited, 
        score: req.body.score,
        username: req.body.username});
    res.status(200).json({
        message: 'Post submitted'
    });

  });


  module.exports = router;