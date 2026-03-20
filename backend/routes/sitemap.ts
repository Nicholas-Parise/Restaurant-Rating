import express from "express";
import db from "../utils/db";
import * as dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT id, COALESCE(updated, created) AS updated_at
      FROM restaurants;
    `);

    const baseUrl = process.env.FRONTEND_URL;

    const urls = result.rows.map(row => {
      return `
        <url>
          <loc>${baseUrl}/restaurant/${row.id}</loc>
          <lastmod>${new Date(row.updated_at).toISOString()}</lastmod>
          <changefreq>weekly</changefreq>
          <priority>0.8</priority>
        </url>
      `;
    }).join('');

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${urls}
      </urlset>`;

    res.header('Content-Type', 'application/xml');
    res.send(sitemap);

  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

export default router;