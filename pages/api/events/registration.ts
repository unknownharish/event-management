import pool from '../../../lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export default async function handler(req, res) {
  if (req.method === 'POST') {
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

    const user_id = decoded.id;
    const { event_id } = req.body;

    if (!event_id) {
      return res.status(400).json({ error: 'Missing event_id' });
    }

    try {


      // check if already registered
      const preCheck = await pool.query(
        `Select * FROM registrations WHERE event_id = $1 AND user_id =$2;`,
        [event_id, user_id]
      );

      if (preCheck.rowCount) {
        return res.status(200).json({ message: 'User Already Registered for Event' });
      }

      const result = await pool.query(
        `INSERT INTO registrations (event_id, user_id) 
         VALUES ($1, $2);`,
        [event_id, user_id]
      );

      res.status(201).json({
        message: 'Registration successful',
        registration: result.rowCount,
      });

    } catch (err) {
      console.error('Registration error:', err);
      res.status(500).json({ error: 'Internal Server Error', errorMessage: err?.message });
    }

  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
