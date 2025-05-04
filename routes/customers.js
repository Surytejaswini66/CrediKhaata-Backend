const express = require('express');
const auth = require('../middleware/auth');
const Customer = require('../models/Customer');

const router = express.Router();

// Create Customer
router.post('/', auth, async (req, res) => {
    try {
        const { name, phone, trustScore } = req.body;

        const customer = new Customer({
            user: req.user.userId,
            name,
            phone,
            trustScore
        });

        await customer.save();
        res.status(201).json({ message: 'Customer created', customer });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Invalid customer data' });
    }
});

// Get all customers (only user's)
router.get('/', auth, async (req, res) => {
    try {
        const customers = await Customer.find({ user: req.user.userId });
        res.json(customers);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get one customer by ID
router.get('/:id', auth, async (req, res) => {
    try {
        const customer = await Customer.findOne({ _id: req.params.id, user: req.user.userId });
        if (!customer) return res.status(404).json({ message: 'Customer not found' });

        res.json(customer);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update customer
router.put('/:id', auth, async (req, res) => {
    try {
        const customer = await Customer.findOneAndUpdate(
            { _id: req.params.id, user: req.user.userId },
            req.body,
            { new: true, runValidators: true }
        );

        if (!customer) return res.status(404).json({ message: 'Customer not found or unauthorized' });

        res.json({ message: 'Customer updated', customer });
    } catch (error) {
        res.status(400).json({ message: 'Invalid data' });
    }
});

// Delete customer
router.delete('/:id', auth, async (req, res) => {
    try {
        const customer = await Customer.findOneAndDelete({ _id: req.params.id, user: req.user.userId });
        if (!customer) return res.status(404).json({ message: 'Customer not found or unauthorized' });

        res.json({ message: 'Customer deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
