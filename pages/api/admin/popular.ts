// GET /api/admin/popular-events - Top events in last 30 days



import moment from 'moment';
import pool from '../../../lib/db';


export default async function handler(req, res) {
    if (req.method === 'GET') {

        const currentDate = moment().format("YYYY-MM-DD HH:mm:ss");
        const prevDate = moment().subtract(30, "d").format("YYYY-MM-DD HH:mm:ss");

        console.log("Current:", currentDate);
        console.log("Previous:", prevDate);
        try {
            const result = await pool.query(
                `
            WITH INFO as 
           (  SELECT event_id, COUNT(user_id) AS registrations
             FROM registrations
             WHERE created_at >= $1 AND created_at <= $2
             GROUP BY event_id
             ORDER BY registrations DESC
             )
             SELECT * from INFO i
             JOIN events e
             ON  i.event_id = e.id;

        `,
                [prevDate, currentDate]
            );
          
            res.status(200).json(result.rows);
        } catch (error) {
            console.error('Error fetching category stats:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }

    }
}
