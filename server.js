require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'frontend')));

// Initialize MySQL database connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'event_management_system',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test connection and initialize table
async function initializeDatabase() {
    try {
        const connection = await pool.getConnection();
        console.log('Connected to the MySQL database.');
        
        // Create feedback table if it doesn't exist
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS feedback (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                event VARCHAR(255) NOT NULL,
                message TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        await connection.query(createTableQuery);
        console.log('Feedback table verified.');
        
        connection.release();
    } catch (err) {
        console.error('Error connecting to MySQL database:', err.message);
        console.error('Please verify your connection details in the .env file.');
    }
}
initializeDatabase();

// Routes

// Welcome Route
app.get('/api/welcome', (req, res) => {
    res.json({ message: 'Welcome to the Event Feedback Management System API!' });
});

// Submit Feedback Route
app.post('/api/feedback', async (req, res) => {
    const { name, event, message } = req.body;
    
    if (!name || !event || !message) {
        return res.status(400).json({ error: 'All fields (name, event, message) are required.' });
    }

    try {
        const sql = 'INSERT INTO feedback (name, event, message) VALUES (?, ?, ?)';
        const [result] = await pool.query(sql, [name, event, message]);
        
        res.status(201).json({ 
            message: 'Feedback submitted successfully!',
            id: result.insertId 
        });
    } catch (err) {
        console.error('Error inserting feedback:', err.message);
        res.status(500).json({ error: 'Failed to submit feedback.' });
    }
});

// Retrieve All Feedback Route
app.get('/api/feedback', async (req, res) => {
    try {
        const sql = 'SELECT * FROM feedback ORDER BY created_at DESC';
        const [rows] = await pool.query(sql);
        res.json({ feedback: rows });
    } catch (err) {
        console.error('Error retrieving feedback:', err.message);
        res.status(500).json({ error: 'Failed to retrieve feedback.' });
    }
});

// Start Server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
