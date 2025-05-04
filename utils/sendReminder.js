// utils/sendReminder.js

const sendSMSReminder = async (phoneNumber, message) => {
    console.log(`Mock SMS sent to ${phoneNumber}: ${message}`);
    return Promise.resolve('mock-sms-sid');
};

const sendWhatsAppReminder = async (phoneNumber, message) => {
    console.log(`Mock WhatsApp message sent to ${phoneNumber}: ${message}`);
    return Promise.resolve('mock-whatsapp-sid');
};

module.exports = { sendSMSReminder, sendWhatsAppReminder };
