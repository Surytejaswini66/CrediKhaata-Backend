const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Loan = require('../models/Loan');
const Customer = require('../models/Customer');
const { sendSMSReminder, sendWhatsAppReminder } = require('../utils/sendReminder');
const { generateReceipt } = require('../utils/generateReceipt'); // Import PDF receipt generator
const axios = require('axios'); // Import axios for making HTTP requests
const { isAfter } = require('date-fns'); // Import isAfter function for overdue logic

// Repayment route
router.post('/:id/repay', auth, async (req, res) => {
    const { amount } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ message: 'Amount must be positive' });

    try {
        const loan = await Loan.findOne({ _id: req.params.id, user: req.user.userId });
        if (!loan) return res.status(404).json({ message: 'Loan not found' });

        const repaid = loan.totalRepaid();
        const remaining = loan.amount - repaid;

        if (amount > remaining) {
            return res.status(400).json({ message: `Only ${remaining} is remaining on this loan.` });
        }

        loan.repayments.push({ amount });
        if (amount === remaining) loan.status = 'paid';

        await loan.save();

        // Generate PDF receipt for the repayment
        const receiptPath = generateReceipt(loan, { amount });

        // Trigger webhook notification to external system
        axios.post('http://external-system.com/webhook/repayment', {
            loanId: loan._id,
            amount: amount,
            customerId: loan.customer
        })
        .then(response => {
            console.log('Webhook notification sent');
        })
        .catch(err => {
            console.error('Error sending webhook:', err);
        });

        // Check if the loan is overdue
        const now = new Date();
        if (loan.status === 'pending' && isAfter(now, loan.dueDate)) {
            loan.status = 'overdue';
            await loan.save();

            // Send reminder to the customer when loan is overdue
            const customer = await Customer.findById(loan.customer);
            const message = `Dear ${customer.name}, your loan of ${loan.amount} is overdue. Please make a payment as soon as possible.`;

            // Use the SMS or WhatsApp function to send reminders
            await sendSMSReminder(customer.phone, message);
            // or for WhatsApp
            // await sendWhatsAppReminder(customer.phone, message);
        }

        res.json({
            message: 'Repayment recorded',
            remaining: loan.amount - loan.totalRepaid(),
            loan,
            receipt: receiptPath // Path to the generated receipt
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create Loan route
router.post('/', auth, async (req, res) => {
    try {
        const { customerId, amount, dueDate } = req.body;

        // Check if the customer belongs to the logged-in user
        const customer = await Customer.findOne({ _id: customerId, user: req.user.userId });
        if (!customer) return res.status(404).json({ message: 'Customer not found or unauthorized' });

        // Create loan and associate with customer
        const newLoan = new Loan({
            user: req.user.userId,
            customer: customerId,
            amount,
            dueDate,
            status: 'pending', // Default status
        });

        await newLoan.save();
        res.status(201).json({ message: 'Loan created', loan: newLoan });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get Loans (with optional status filter & overdue status check)
router.get('/', auth, async (req, res) => {
    try {
        const { status } = req.query;
        const now = new Date();

        // First update overdue loans for the user
        const userLoans = await Loan.find({ user: req.user.userId });
        for (const loan of userLoans) {
            if (loan.status === 'pending' && new Date(loan.dueDate) < now) {
                loan.status = 'overdue';
                await loan.save();
            }
        }

        // Now filter and return
        const filter = { user: req.user.userId };
        if (status) filter.status = status;

        const loans = await Loan.find(filter).populate('customer', 'name phone');
        res.json({ loans });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Mark Loan as Paid route
router.patch('/:id/mark-paid', auth, async (req, res) => {
    try {
        const loan = await Loan.findOne({ _id: req.params.id, user: req.user.userId });
        if (!loan) return res.status(404).json({ message: 'Loan not found or unauthorized' });

        loan.status = 'paid';
        await loan.save();

        res.json({ message: 'Loan marked as paid', loan });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get loan summary
router.get('/summary', auth, async (req, res) => {
    try {
        const loans = await Loan.find({ user: req.user.userId });

        let totalLoaned = 0, totalCollected = 0, overdueAmount = 0, repaidTimes = [];

        loans.forEach(loan => {
            const repaid = loan.totalRepaid();
            totalLoaned += loan.amount;
            totalCollected += repaid;

            if (loan.status === 'pending' && isAfter(new Date(), loan.dueDate)) {
                loan.status = 'overdue';
                loan.save(); // async fire-and-forget
                overdueAmount += loan.amount - repaid;
            } else if (loan.status === 'overdue') {
                overdueAmount += loan.amount - repaid;
            }

            if (loan.status === 'paid') {
                const firstRepay = loan.repayments[0]?.date;
                const lastRepay = loan.repayments.slice(-1)[0]?.date;
                if (firstRepay && lastRepay) {
                    const days = (new Date(lastRepay) - new Date(firstRepay)) / (1000 * 60 * 60 * 24);
                    repaidTimes.push(days);
                }
            }
        });

        const avgRepayTime = repaidTimes.length ? (repaidTimes.reduce((a, b) => a + b, 0) / repaidTimes.length).toFixed(2) : 0;

        res.json({
            totalLoaned,
            totalCollected,
            overdueAmount,
            avgRepaymentTimeInDays: avgRepayTime
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get overdue loans and send reminders
router.get('/overdue', auth, async (req, res) => {
    try {
        const overdueLoans = await Loan.find({ user: req.user.userId, status: { $in: ['pending', 'overdue'] } })
            .populate('customer', 'name phone');

        const now = new Date();
        const filtered = [];

        for (const loan of overdueLoans) {
            if (loan.status === 'pending' && isAfter(now, loan.dueDate)) {
                loan.status = 'overdue';
                await loan.save();

                // Send reminder to the customer when loan is overdue
                const customer = await Customer.findById(loan.customer);
                const message = `Dear ${customer.name}, your loan of ${loan.amount} is overdue. Please make a payment as soon as possible.`;

                // Use the SMS or WhatsApp function to send reminders
                await sendSMSReminder(customer.phone, message);
                // or for WhatsApp
                // await sendWhatsAppReminder(customer.phone, message);
            }

            if (loan.status === 'overdue') {
                filtered.push(loan);
            }
        }

        res.json({ overdueLoans: filtered });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
