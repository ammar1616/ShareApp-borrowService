const axios = require('axios');
const httpStatus = require('http-status-codes').StatusCodes;

const updateItem = async (token, itemId, unavailabeDurations) => {
  try {
    const headers = {
      'Content-Type': 'application/json',
      'x-auth-token': token,
    };

    const response = await axios.patch(
      `${process.env.ITEM_SERVICE_URL}/${itemId}`,
      { unavailabeDurations },
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
    console.error('Error updating item:', error.message);
    throw new Error('Error updating item');
  }
};

module.exports = updateItem;
