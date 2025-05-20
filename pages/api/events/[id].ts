// GET /api/events/:id - Fetch single event details





import pool from '../../../lib/db';

export default async function handler(req, res) {
    if (req.method === 'GET') {

        try {

            let id = req.query?.id;

            console.log("param is", id)
            const result = await pool.query(
                'SELECT * FROM events WHERE id = $1 limit 1',
                [id]
            );
            res.status(200).json(result.rows);

        } catch (error) {
            console.error('Error fetching events:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }

    }
}