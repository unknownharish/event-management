// GET /api/events - List events with pagination and filters

import moment from 'moment';
import pool from '../../../lib/db';
import jwt from 'jsonwebtoken';


const JWT_SECRET = process.env.JWT_SECRET;



export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const query = req.query?.name || '';
      const page = parseInt(req.query?.page) || 1;
      const limit = 10;
      const offset = (page - 1) * limit;
      const currentDate = moment().format("YYYY-MM-DD HH:mm:ss");

      console.log("Search query:", query);
      console.log("Page:", page, "Limit:", limit);

      const result = await pool.query(
        `
      SELECT * FROM events
      WHERE title ILIKE $1 AND date >= $2
      ORDER BY date DESC
      LIMIT $3 OFFSET $4
      `,
        [`%${query}%`, currentDate, limit, offset]
      );

      const countResult = await pool.query(
        `SELECT COUNT(*) FROM events WHERE title ILIKE $1`,
        [`%${query}%`]
      );

      const total = parseInt(countResult.rows[0].count);

      res.status(200).json({
        data: result.rows,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      });

    } catch (error) {
      console.error('Error fetching events:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  else if (req.method === 'POST') {


    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid Authorization header' });
    }

    const token = authHeader.split(' ')[1];

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    const created_by = decoded.id;



    const { title, description, location, date, category ,event_image} = req.body;

    // for txn we have to get the client for pause
    const client = await pool.connect();

    try {

      await client.query('BEGIN');
      const result = await client.query(
        'INSERT INTO events (title, description, location, date, category, created_by,event_image) VALUES ($1, $2, $3, $4, $5, $6,$7) RETURNING *',
        [title, description, location, date, category, created_by,event_image]
      );

      await client.query('COMMIT');
      res.status(201).json(result.rows[0]);
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error creating event:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } finally {
      client.release();
    }


  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
