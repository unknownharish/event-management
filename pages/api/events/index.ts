// GET /api/events - List events with pagination and filters

import pool from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const query = req.query?.name || '';
      const page = parseInt(req.query?.page) || 1;
      const limit =  10;
      const offset = (page - 1) * limit;

      console.log("Search query:", query);
      console.log("Page:", page, "Limit:", limit);

      const result = await pool.query(
        `
      SELECT * FROM events
      WHERE title ILIKE $1
      ORDER BY date DESC
      LIMIT $2 OFFSET $3
      `,
        [`%${query}%`, limit, offset]
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
    const { title, description, location, date, category, created_by } = req.body;

    // for txn we have to get the client for pause
    const client = await pool.connect();

    try {

      await client.query('BEGIN');
      const result = await client.query(
        'INSERT INTO events (title, description, location, date, category, created_by) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [title, description, location, date, category, created_by]
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
