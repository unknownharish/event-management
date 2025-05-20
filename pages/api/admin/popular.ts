// GET /api/admin/popular-events - Top events in last 30 days



import moment from 'moment';
import pool from '../../../lib/db';


export default async function handler(req, res) {
    if (req.method === 'GET') {

        // const currentDate = moment().format("YYYY-MM-DD HH:mm:ss");
        // const prevDate = moment().subtract(30, "d").format("YYYY-MM-DD HH:mm:ss");
        const currentDate = moment().add(300,"d").format("YYYY-MM-DD HH:mm:ss");
        const prevDate = moment().subtract(1, "d").format("YYYY-MM-DD HH:mm:ss");

        console.log("Current:", currentDate);
        console.log("Previous:", prevDate);
        try {
            const result = await pool.query(
                `
        SELECT  count(event_id) FROM registrations 
        WHERE created_at >= $1 AND created_at <= $2
        ;
        `,
                [prevDate, currentDate]
            );
        //     const result = await pool.query(
        //         `
        // SELECT 
        //   e.category,
        //   COUNT(*) AS total_registrations
        // FROM 
        //   registrations r
        // JOIN 
        //   events e ON r.event_id = e.id
        // WHERE 
        //   r.created_at >= $1 AND r.created_at <= $2
        // GROUP BY 
        //   e.category
        // ORDER BY 
        //   total_registrations DESC
        // LIMIT 1
        // ;
        // `,
        //         [prevDate, currentDate]
        //     );

            // if (result.rows.length === 0) {
            //     return res.status(200).json({ message: "No registrations in the last 30 days" });
            // }

            // const topCategory = result.rows[0];

            // res.status(200).json({
            //     topCategory: topCategory.category,
            //     registrations: parseInt(topCategory.total_registrations, 10)
            // });
            res.status(200).json(result.rows);
        } catch (error) {
            console.error('Error fetching category stats:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }

    }
}
