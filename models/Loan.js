const mongoose = require('mongoose');

// Repayment schema to track each repayment made
const repaymentSchema = new mongoose.Schema({
    amount: { type: Number, required: true }, // Amount paid
    date: { type: Date, default: Date.now }  // Date of repayment
});

// Loan schema with repayments array to store all repayment records
const loanSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 1
    },
    dueDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'paid', 'overdue'],
        default: 'pending'
    },
    repayments: [repaymentSchema] // Array to store repayment details
}, { timestamps: true });

// Method to calculate the total amount repaid
loanSchema.methods.totalRepaid = function () {
    return this.repayments.reduce((sum, r) => sum + r.amount, 0);
};

const Loan = mongoose.model('Loan', loanSchema);

module.exports = Loan;
