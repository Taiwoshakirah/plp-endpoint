const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth');
const expenseRoutes = require('./routes/expense');
const ErrorResponse = require('./utils/errorResponse');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 7000;


app.use(express.json());
app.use(cookieParser());


app.use('/api/auth', authRoutes);
app.use('/api', expenseRoutes);


app.use((err, req, res, next) => {
    console.error(err.message);  
    console.error(err.stack);    
    res.status(err.statusCode || 500).json({
        success: false,
        error: err.message || 'Server Error'
    });
});

app.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
});
