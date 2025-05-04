const express = require('express');
const router = express.Router();

router.post('/repayment', (req, res) => {
    console.log('Webhook received:', req.body);
    res.status(200).json({ message: 'Webhook received' });
});

module.exports = router;
