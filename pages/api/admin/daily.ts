// GET /api/admin/registrations/daily - Registrations grouped by day


import moment from 'moment';
import pool from '../../../lib/db';


export default async function handler(req, res) {
    if (req.method === 'GET') {

        const currentDate = moment().format("YYYY-MM-DD HH:mm:ss");
        const prevDate = moment().subtract(1, "d").format("YYYY-MM-DD HH:mm:ss");

        console.log("Current:", currentDate);
        console.log("Previous:", prevDate);

        try {
            const result = await pool.query(
                `SELECT COUNT(*) FROM registrations WHERE created_at >= $1 AND created_at <= $2`,
                [prevDate, currentDate]
            );

            const userEnrollCount = result.rows[0].count;

            res.status(200).json({dailyRegistered:userEnrollCount});
        } catch (error) {
            console.error('Error fetching stats:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }


    }
}