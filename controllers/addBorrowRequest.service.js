const httpStatus = require('http-status-codes').StatusCodes;
const { db } = require('../startup/firebase');
const validateBorrowRequest = require('../models/borrowRequest.model');
const formatDate = require('../helpers/formatDate');
const sendBorrowingRequestNotification = require('../helpers/notifyBorrowingRequest');

const addBorrowRequest = async (req, res) => {
  let { itemId, startDate, endDate, conditionBefore } = req.body;

  const { error } = validateBorrowRequest(req.body);

  if (error) {
    console.warn(`Invalid borrow request data format: ${error}`);
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ error: `Invalid borrow request data format: ${error}` });
  }

  const borrowRequestRef = await db
    .collection(process.env.BORROW_REQUESTS_DOC)
    .where('borrowerId', '==', req.user.id)
    .where('itemId', '==', itemId)
    .where('status', '!=', process.env.BORROW_REQUEST_COMPLETED_STATUS)
    .get();

  if (!borrowRequestRef.empty) {
    console.warn('Borrow Request for this item is already open for this user');
    return res.status(httpStatus.CONFLICT).json({
      error: 'Borrow Request for this item is already open for this user',
    });
  }

  const itemRef = await db.collection(process.env.ITEMS_DOC).doc(itemId).get();
  if (!itemRef.exists) {
    console.log('Item not found');
    return res.status(httpStatus.NOT_FOUND).json({ error: 'Item not found' });
  }

  const ownerId = itemRef.data().ownerId;

  const userRef = await db.collection(process.env.USERS_DOC).doc(ownerId).get();
  if (!userRef.exists) {
    console.log('User not found');
    return res.status(httpStatus.NOT_FOUND).json({ error: 'User not found' });
  }

  startDate = formatDate(startDate);
  endDate = formatDate(endDate);
  conditionBefore = conditionBefore || null;

  const newBorrowRequestRef = await db
    .collection(process.env.BORROW_REQUESTS_DOC)
    .add({
      itemId,
      borrowerId: req.user.id,
      startDate,
      endDate,
      status: process.env.BORROW_REQUEST_SENT_STATUS,
      conditionBefore,
      conditionAfter: null,
    });

  const userData = userRef.data();

  await sendBorrowingRequestNotification(
    userData.email,
    userData.name,
    req.user.name,
    itemRef.data().itemName
  );

  res.status(httpStatus.CREATED).json({
    message: 'Borrow Request created successfully',
    paymentMethod: {
      id: newBorrowRequestRef.id,
      borrowerId: req.user.id,
      startDate,
      endDate,
      status: process.env.BORROW_REQUEST_SENT_STATUS,
      conditionBefore,
      conditionAfter: null,
    },
  });
};

module.exports = addBorrowRequest;
