const axios = require('axios');
const httpStatus = require('http-status-codes').StatusCodes;

const sendDamageClaimNotification = async (borrowerEmail, borrowerName, lenderName, itemName) => {
  try {
    const response = await axios.post(
      `${process.env.NOTIFICATION_SERVICE_URL}/damageClaim`,
      { borrowerEmail, borrowerName, lenderName, itemName }
    );

    if (response.status == httpStatus.OK) {
      console.log(response.data.message);
      return {
        message:
          'Damage Claim has been sent to the relevant user.',
      };
    } else if (response.status == httpStatus.ACCEPTED) {
      console.log(response.data.message);
      return { message: 'Notifications are disabled' };
    } else {
      console.error('Error sending notification:', response.data.error);
      throw new Error('Error sending notification');
    }
  } catch (error) {
    console.error('Error sending notification:', error.message);
    throw new Error('Error sending notification');
  }
};

module.exports = sendDamageClaimNotification;
