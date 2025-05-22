import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();


console.log("process", process.env.POSTGRES_PASSWORD)


const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.DB_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD?.toString(),
  port: 5432,
});


async function seed() {
  try {

    // drop tables
    // await pool.query(`TRUNCATE TABLE registrations, events, users RESTART IDENTITY CASCADE;`)


    await pool.query(`
      INSERT INTO users (name, email, password) VALUES
      ('Admin User', 'admin@gmail.com', 'admin'),
        ('Bob Smith', 'bob@gmail.com', '12345');
    `);

    await pool.query(`
      INSERT INTO events (title, description, location, date,event_image, created_by, category, status) VALUES
        ('Tech Conference 2025', 'Annual tech event.', 'New York', '2025-06-15 10:00:00','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOHh-w2kJjp6R6WB1GpXMkREw6XaNU5JCP0w&s', 1, 'tech', TRUE),
        ('Webinar on Web Security', 'Learn how to secure web apps.', 'Online', '2025-06-10 15:00:00','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSD_YneH8gZ9NYuzba4O8Z_F4bpPNA2uPGM_Q&s', 2, 'webinars', TRUE);
    `);

    await pool.query(`
      INSERT INTO registrations (event_id, user_id) VALUES
        (1, 2),
        (2, 1);
    `);

    console.log('Seeding complete');
  } catch (err) {
    console.error('Error seeding database:', err);
  } finally {
    await pool.end();
  }
}

seed();
