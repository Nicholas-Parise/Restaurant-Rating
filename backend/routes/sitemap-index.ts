import express from "express";
import db from "../utils/db";
import * as dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

router.get('/', async (req, res) => {

  try {
    const result = await db.query(`SELECT COUNT(*) FROM restaurants`);
    const total = parseInt(result.rows[0].count, 10);

    const limit = 50000;
    const totalPages = Math.ceil(total / limit);

    const baseUrl = process.env.BACKEND_URL;

    let sitemaps = '';

    for (let i = 1; i <= totalPages; i++) {
      sitemaps += `
        <sitemap>
          <loc>${baseUrl}/sitemap-${i}.xml</loc>
        </sitemap>
      `;
    }

    const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
      <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${sitemaps}
      </sitemapindex>`;

    res.header('Content-Type', 'application/xml');
    res.send(sitemapIndex);

  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

export default router;