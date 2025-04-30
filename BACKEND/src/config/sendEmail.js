const Brevo = require('@getbrevo/brevo');
require('dotenv').config();

const apiInstance = new Brevo.TransactionalEmailsApi();
console.log('Brevo API ',process.env.BREVO_API_KEY);
// Gán API key
apiInstance.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);

/**
 * Function to send an email using Brevo
 * @param {Object} sender - The sender's email and name (e.g., { email: "sender@example.com", name: "Sender Name" })
 * @param {Array} recipients - Array of recipient objects (e.g., [{ email: "recipient@example.com", name: "Recipient Name" }])
 * @param {String} subject - The subject of the email
 * @param {String} htmlContent - The HTML content of the email
 * @returns {Promise} - Resolves if the email is sent successfully, rejects otherwise
 */
const sendEmail = async (sender, recipients, subject, htmlContent) => {
  const sendSmtpEmail = {
    sender,
    to: recipients,
    subject,
    htmlContent,
  };

  try {
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('Email sent successfully:', data);
    return data;
  } catch (error) {
    console.error('Error sending email:', error.response?.body || error);
    throw error;
  }
};

module.exports = {
  sendEmail,
};
