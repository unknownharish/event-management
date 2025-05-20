// GET /api/events - List events with pagination and filters

import pool from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {

    try {

      let query = req.query?.name;

      console.log("query is", query)
      const result = await pool.query(
        'SELECT * FROM events WHERE title ILIKE $1 ORDER BY date DESC',
        [`%${query}%`]
      );
      res.status(200).json(result.rows);

    } catch (error) {
      console.error('Error fetching events:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }

  } else if (req.method === 'POST') {
    const { title, description, location, date, category, created_by } = req.body;

    // for txn we have to get the client for pause
    const client = await pool.connect();

    try {

      await client.query('BEGIN'); // create txn

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
      client.release(); // remove the session  release the lock
    }


  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
