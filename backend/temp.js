


app.get('/api/reviews', async (req, res) => {
    const { restaurantId, page = 1, pageSize = 10 } = req.query;
  
    // Calculate offset for the database query
    const offset = (page - 1) * pageSize;
  
    try {
      // Execute the paginated query
      const reviews = await db.query(
        'SELECT * FROM reviews WHERE restaurant_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
        [restaurantId, pageSize, offset]
      );
  
      // Optionally, get the total count of reviews for pagination metadata
      const totalReviews = await db.query(
        'SELECT COUNT(*) FROM reviews WHERE restaurant_id = $1',
        [restaurantId]
      );
  
      res.json({
        reviews: reviews.rows,
        total: totalReviews.rows[0].count,
        page: Number(page),
        pageSize: Number(pageSize),
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch reviews' });
    }
  });


  app.get('/api/user-reviews', async (req, res) => {
    const { userId, page = 1, pageSize = 10 } = req.query;
  
    const offset = (page - 1) * pageSize;
  
    try {
      const reviews = await db.query(
        'SELECT * FROM reviews WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
        [userId, pageSize, offset]
      );
  
      const totalReviews = await db.query(
        'SELECT COUNT(*) FROM reviews WHERE user_id = $1',
        [userId]
      );
  
      res.json({
        reviews: reviews.rows,
        total: totalReviews.rows[0].count,
        page: Number(page),
        pageSize: Number(pageSize),
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch user reviews' });
    }
  });
  

