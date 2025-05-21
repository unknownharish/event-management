// GET /api/admin/registrations/daily - Registrations grouped by day


import moment from 'moment';
import pool from '../../../lib/db';
import jwt from 'jsonwebtoken';


const JWT_SECRET = process.env.JWT_SECRET;

export default async function handler(req, res) {
    if (req.method === 'GET') {

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


        const currentDate = moment().format("YYYY-MM-DD HH:mm:ss");
        const prevDate = moment().subtract(1, "d").startOf("d").format("YYYY-MM-DD HH:mm:ss");

        console.log("Current:", currentDate);
        console.log("Previous:", prevDate);

        try {

            const [userEnrollInEvents, userRegistered, eventRegistered] = await Promise.all([

                pool.query(
                    `SELECT COUNT(*) FROM registrations WHERE created_at >= $1 AND created_at <= $2`,
                    [prevDate, currentDate]
                ),
                pool.query(
                    `SELECT COUNT(*) FROM users WHERE created_at >= $1 AND created_at <= $2`,
                    [prevDate, currentDate]
                ),
                pool.query(
                    `SELECT COUNT(*) FROM events WHERE created_at >= $1 AND created_at <= $2`,
                    [prevDate, currentDate]
                ),


            ])

            const userEnrollCount = userEnrollInEvents.rows[0].count;
            const userRegisterCount = userRegistered.rows[0].count;
            const eventRegisterCount = eventRegistered.rows[0].count;

            res.status(200).json({
                dailyRegisteredForEvents: userEnrollCount,
                userRegistered: userRegisterCount,
                eventRegistered: eventRegisterCount,

            });

        } catch (error) {
            console.error('Error fetching stats:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }


    }
}