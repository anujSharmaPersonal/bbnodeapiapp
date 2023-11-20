const express = require('express');

const { Pool } = require('pg');

const app = express();

var cors = require('cors');
app.use(cors());

// Set up a PostgreSQL connection pool
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'bbaibot',
    password: 'Postgresql@4321',
    port: 5432
});

app.use(express.json());

// API to add a user
app.post('/api/users', async (req, res) => {
    try {
        const { name, email, city, number, age } = req.body;
        const query = 'INSERT INTO users (name, email, city, number, age) VALUES ($1, $2, $3, $4, $5) RETURNING *';
        const values = [name, email, city, number, age];
        const result = await pool.query(query, values);
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// API to get a user by email
app.get('/api/users/:email', async (req, res) => {
    try {
        const email = req.params.email;
        const query = 'SELECT * FROM users WHERE email = $1';
        const result = await pool.query(query, [email]);
        if (result.rows.length === 0) {
            res.status(404).json({ error: 'User not found' });
        } else {
            res.json(result.rows[0]);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const port = 1234; // Set the port for your application
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
