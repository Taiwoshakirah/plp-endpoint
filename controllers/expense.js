// expense.js
const db = require('../db');
const jwt = require('jsonwebtoken');

// Middleware to authenticate and authorize user
const authenticate = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).send('Unauthorized');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).send('Unauthorized');
    }
};

const getExpenses = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM expenses WHERE user_id = ?', [req.user.username]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createExpense = async (req, res) => {
    const { description, amount, category, date } = req.body;
    try {
        const [result] = await db.query('INSERT INTO expenses (user_id, description, amount, category, date) VALUES (?, ?, ?, ?, ?)', [req.user.username, description, amount, category, date]);
        res.json({ id: result.insertId, description, amount, category, date });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateExpense = async (req, res) => {
    const { description, amount, category, date } = req.body;
    try {
        const [result] = await db.query('UPDATE expenses SET description = ?, amount = ?, category = ?, date = ? WHERE id = ? AND user_id = ?', [description, amount, category, date, req.params.id, req.user.username]);
        res.json({ affectedRows: result.affectedRows });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteExpense = async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM expenses WHERE id = ? AND user_id = ?', [req.params.id, req.user.username]);
        res.json({ affectedRows: result.affectedRows });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getTotalExpense = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT SUM(amount) AS total_expense FROM expenses WHERE user_id = ?', [req.user.username]);
        res.json({ total_expense: rows[0].total_expense });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getExpenses, createExpense, updateExpense, deleteExpense, getTotalExpense, authenticate };
