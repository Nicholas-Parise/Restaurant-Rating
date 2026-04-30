import express from "express";
import db from "../utils/db";
import authenticate from "../middleware/authenticate";
import { getUserId } from "../utils/util";

const router = express.Router();

// amount = fast 0 or full 1
// localhost:3000/restaurants?page=1&pageSize=10?amount=0
router.get('/', async (req, res, next) => {

  const page = Number(req.query.page) || 1;
  let pageSize = Number(req.query.pageSize) || 10;
  const amount = Number(req.query.amount) || 1;
  const offset = (page - 1) * pageSize;
  let result;


  if (pageSize && pageSize > 100) {
    pageSize = 100;
  }

  try {
    if (amount == 1) {
      result = await db.query(
        `SELECT *, COUNT(*) OVER() AS total_count 
        FROM (
          SELECT * FROM restaurants 
        ) sub
        LIMIT $1 OFFSET $2;`, [pageSize, offset]);

    } else {
      result = await db.query(
        `SELECT *, COUNT(*) OVER() AS total_count 
        FROM (
          SELECT id, name, pictures, type, slug FROM restaurants 
        ) sub
        LIMIT $1 OFFSET $2;`, [pageSize, offset]);
    }

    const restaurants = result.rows;
    const totalRestaurants = restaurants[0]?.total_count ?? 0;

    res.json({
      restaurants,
      totalRestaurants,
      page,
      pageSize
    });


  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});


// amount = fast 0 or full 1
// localhost:3000/restaurants/search?page=1&pageSize=10?amount=0
router.get('/search', async (req, res, next) => {

  const searchTerm = req.query.q;
  const lat = Number(req.query.lat);
  const lng = Number(req.query.lng);
  const radiusInMeters = Number(req.query.rad) * 1000 || 10000;

  const page = Number(req.query.page) || 1;
  let pageSize = Number(req.query.pageSize) || 10;
  const offset = (page - 1) * pageSize;

  var result;

  if (pageSize && pageSize > 100) {
    pageSize = 100;
  }

  try {
    if (searchTerm) {
      if (lat && lng) {
        result = await db.query(`
        SELECT *, COUNT(*) OVER() AS total_count 
        FROM (
          SELECT r.id, r.name, r.pictures, r.type, r.slug, l.city, similarity(r.name, $4) AS sim,
        ST_Distance(
          l.geom::geography,
          ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography
        ) AS dist
        FROM locations l
        JOIN restaurants r ON l.id = r.location_id
        WHERE ST_DWithin(
          l.geom::geography,
          ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,
          $3
        )
        AND r.name % $4
        ) sub
        ORDER BY dist ASC, sim DESC
        LIMIT $5 OFFSET $6;
      `, [lng, lat, radiusInMeters, searchTerm, pageSize, offset]);
      } else {
        result = await db.query(
          `SELECT *, COUNT(*) OVER() AS total_count 
          FROM (
          SELECT *, similarity(name, $1) AS sim
          FROM restaurants
          WHERE name % $1
          ) sub
          ORDER BY sim DESC
          LIMIT $2 OFFSET $3;`, [searchTerm, pageSize, offset]);
      }

    } else {

      if (lat && lng) {
        result = await db.query(`
        SELECT *, COUNT(*) OVER() AS total_count 
          FROM (
        SELECT r.id, r.name, r.pictures, r.type, r.slug, l.city, 
        ST_Distance(
          l.geom::geography,
          ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography
        ) AS dist
        FROM locations l
        JOIN restaurants r ON l.id = r.location_id
        WHERE ST_DWithin(
          l.geom::geography,
          ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,
          $3
        )
        ) sub
        ORDER BY dist ASC
        LIMIT $4 OFFSET $5;
      `, [lng, lat, radiusInMeters, pageSize, offset]);

      } else {
          result = await db.query(`
          WITH count_estimate AS (
            SELECT reltuples::bigint AS total_count
            FROM pg_class
            WHERE oid = 'restaurants'::regclass
          )
          SELECT r.id, r.name, r.pictures, r.type, r.slug, c.total_count
          FROM restaurants r, count_estimate c
          LIMIT $1 OFFSET $2;`, [pageSize, offset]);


      }
    }
    const restaurants = result.rows;

    const totalRestaurants = restaurants[0]?.total_count ?? 0;

    return res.json({
      restaurants,
      totalRestaurants,
      page,
      pageSize
    });

  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});



router.get('/popular', async (req, res, next) => {

  try {

    const result = await db.query(
      `SELECT r.id, r.name, r.pictures, r.type, r.slug, p.priority 
       FROM restaurants r
       JOIN popular p ON r.id = p.restaurant_id 
        `, []);


    const restaurants = result.rows;
    const totalRestaurants = restaurants.length;

    res.json({
      restaurants,
      totalRestaurants
    });

  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});




// localhost:3000/restaurants
router.get('/:restaurantId', async (req, res, next) => {

  const restaurantId = parseInt(req.params.restaurantId);

  try {
    const result = await db.query(
      `SELECT r.*, l.housenumber, l.addr, l.city, l.province, l.country, l.postalcode, l.lat, l.lon,
      json_agg(
        json_build_object(
          'id', c.id,
          'name', c.name
        )
      ) FILTER (WHERE c.id IS NOT NULL) AS categories
      FROM restaurants r
      JOIN locations l ON l.id = r.location_id
      LEFT JOIN restaurant_cats rc ON rc.restaurant_id = r.id
      LEFT JOIN categories c ON c.id = rc.category_id 
      WHERE r.id = $1
      GROUP BY r.id, l.id;`, [restaurantId]);

    const restaurants = result.rows[0];

    const reviewResult = await db.query(`
          SELECT r.*, u.name, u.username, u.picture 
          FROM reviews r 
          LEFT JOIN users u ON r.user_id = u.id
          WHERE r.restaurant_id = $1 AND r.visited = TRUE
          ORDER BY r.created DESC
          LIMIT 20 OFFSET 0;`, [restaurantId]);


    const reviews = reviewResult.rows;

    res.json({
      restaurants,
      reviews
    });

  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/', (req, res) => {

  res.status(200).json({
    message: 'Post submitted'
  });
});

//module.exports = router;
export default router;