const axios = require('axios');
const httpStatus = require('http-status-codes').StatusCodes;

const updateEscrowTransaction = async (token, escrowTransactionId, status) => {
  try {
    const headers = {
      'Content-Type': 'application/json',
      'x-auth-token': token,
    };

    const response = await axios.patch(
      `${process.env.PAYMENT_SERVICE_URL}/escrowTransaction/${escrowTransactionId}`,
      { status },
      { headers: headers }
    );

    if (response.status == httpStatus.OK) {
      console.log(response.data.message);
      return { status: response.status, message: response.data.message };
    } else {
      console.error(response.data.error);
      throw new Error(response.data.error);
    }
  } catch (error) {
    console.error('Error updating escrow transaction:', error.message);
    throw new Error('Error updating escrow transaction');
  }
};

module.exports = updateEscrowTransaction;
