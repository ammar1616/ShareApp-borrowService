const axios = require('axios');
const httpStatus = require('http-status-codes').StatusCodes;

const addEscrowTransaction = async (token, requestId, lenderId, borrowerId, amount) => {
  try {
    const headers = {
      'Content-Type': 'application/json',
      'x-auth-token': token,
    };

    const response = await axios.post(
      `${process.env.PAYMENT_SERVICE_URL}/escrowTransaction`,
      { requestId, lenderId, borrowerId, amount },
      { headers: headers }
    );

    if (response.status == httpStatus.CREATED) {
      console.log(response.data.message);
      return { status: response.status, message: response.data.message };
    } else {
      console.error(response.data.error);
      throw new Error(response.data.error);
    }
  } catch (error) {
    console.error('Error creating escrow transaction:', error.message);
    throw new Error('Error creating escrow transaction');
  }
};

module.exports = addEscrowTransaction;
