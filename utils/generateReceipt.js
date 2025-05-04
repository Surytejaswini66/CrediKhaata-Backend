const fs = require('fs');
const PDFDocument = require('pdfkit');

function generateReceipt(loan, repayment) {
    const doc = new PDFDocument();
    const path = `receipts/receipt_${loan._id}_${Date.now()}.pdf`;
    doc.pipe(fs.createWriteStream(path));

    doc.fontSize(20).text('Loan Repayment Receipt', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Loan ID: ${loan._id}`);
    doc.text(`Customer: ${loan.customer}`);
    doc.text(`Amount Repaid: ${repayment.amount}`);
    doc.text(`Date: ${new Date().toLocaleDateString()}`);

    doc.end();
    return path;
}

module.exports = { generateReceipt };
