const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const loanRoutes = require('./routes/loans'); // Import loans routes
const customerRoutes = require('./routes/customers'); // Import customers routes

dotenv.config();
app.get('/', (req, res) => {
    res.send('CrediKhaata Backend is Running');
  });
  
const app = express();
app.use(express.json());
app.use('/loans', loanRoutes);
// index.js or app.js
const webhookRoutes = require('./routes/webhook');
app.use('/webhook', webhookRoutes);

// Register routes
app.use('/', authRoutes); // Ensure loan routes are prefixed with /loans
app.use('/customers', customerRoutes); // Ensure customer routes are prefixed with /customers

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch((err) => console.error('❌ MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
