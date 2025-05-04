const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const loanRoutes = require('./routes/loans');
const customerRoutes = require('./routes/customers');
const webhookRoutes = require('./routes/webhook');

dotenv.config();

const app = express(); // ✅ Define app before using it

app.use(express.json());

app.get('/', (req, res) => {
  res.send('CrediKhaata Backend is Running');
});

app.use('/loans', loanRoutes);
app.use('/webhook', webhookRoutes);
app.use('/', authRoutes);
app.use('/customers', customerRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
