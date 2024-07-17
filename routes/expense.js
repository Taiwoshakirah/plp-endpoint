const express = require('express');
const { getExpenses, createExpense, updateExpense, deleteExpense, getTotalExpense } = require('../controllers/expense');
const { protect } = require('../middleware/auth'); 
const router = express.Router();

router.post('/expenses', createExpense); 
router.get('/expense', getTotalExpense); 

router.use(protect); 

router.get('/expenses', getExpenses);
router.put('/expenses/:id', updateExpense);
router.delete('/expenses/:id', deleteExpense);

module.exports = router;
