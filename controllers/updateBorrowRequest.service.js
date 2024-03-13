const httpStatus = require('http-status-codes').StatusCodes;
const { db } = require('../startup/firebase');
const addEscrowTransaction = require('../helpers/addEscrowTransaction.service');
const updateEscrowTransaction = require('../helpers/updateEscrowTransaction.service');
const updateItem = require('../helpers/updateItem.service');
const notifyDamageClaim = require('../helpers/notifyDamageClaim');

const VALID_BORROW_REQUEST_STATUSES = [
  process.env.BORROW_REQUEST_ACTIVE_STATUS,
  process.env.BORROW_REQUEST_REJECTED_STATUS,
  process.env.BORROW_REQUEST_RETURNED_STATUS,
  process.env.BORROW_REQUEST_DAMAGE_CLAIM_STATUS,
  process.env.BORROW_REQUEST_COMPLETED_STATUS,
];

const updateBorrowRequest = async (req, res) => {
  const borrowRequestId = req.params.id;
  const { status, conditionBefore, conditionAfter } = req.body;

  if (!status || !VALID_BORROW_REQUEST_STATUSES.includes(status)) {
    console.warn('Invalid status value');
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ error: 'Invalid status value' });
  }

  const userItemsSnapshot = await db
    .collection(process.env.ITEMS_DOC)
    .where('ownerId', '==', req.user.id)
    .get();

  const userItemIds = userItemsSnapshot.docs.map((doc) => doc.id);

  const borrowRequestRef = await db
    .collection(process.env.BORROW_REQUESTS_DOC)
    .doc(borrowRequestId)
    .get();

  if (!borrowRequestRef.exists) {
    return res
      .status(httpStatus.NOT_FOUND)
      .json({ error: 'Borrow Request not found' });
  }

  const borrowRequestData = borrowRequestRef.data();

  if (
    borrowRequestData.borrowerId !== req.user.id &&
    !userItemIds.includes(borrowRequestData.itemId)
  ) {
    return res
      .status(httpStatus.FORBIDDEN)
      .json({ error: 'Unauthorized access to the Borrow Request' });
  }

  const updateObj = {};

  if (status === process.env.BORROW_REQUEST_ACTIVE_STATUS) {
    const itemRef = await db
      .collection(process.env.ITEMS_DOC)
      .doc(borrowRequestData.itemId)
      .get();

    if (!itemRef.exists) {
      return res.status(httpStatus.NOT_FOUND).json({ error: 'Item not found' });
    }

    const ownerId = itemRef.data().ownerId;
    const price = itemRef.data().price;
    const unavailableDuration = {
      startDate: borrowRequestData.startDate,
      endDate: borrowRequestData.endDate,
    };

    await addEscrowTransaction(
      req.header('x-auth-token'),
      borrowRequestId,
      ownerId,
      borrowRequestData.borrowerId,
      price
    );
    await updateItem(req.header('x-auth-token'), borrowRequestData.itemId, unavailableDuration);

    updateObj.status = status;
    if (conditionBefore) updateObj.conditionBefore = conditionBefore;
  } else if (
    status === process.env.BORROW_REQUEST_RETURNED_STATUS ||
    status === process.env.BORROW_REQUEST_REJECTED_STATUS
  ) {
    updateObj.status = status;
  } else if (status === process.env.BORROW_REQUEST_COMPLETED_STATUS) {
    const escrowTransactionRef = await db
      .collection(process.env.ESCROW_TRANSACTIONS_DOC)
      .where('requestId', '==', borrowRequestId)
      .get();

    const escrowTransactionId = escrowTransactionRef.docs[0].id;
    await updateEscrowTransaction(req.header('x-auth-token'), escrowTransactionId, 'Released');

    updateObj.status = status;
    if (conditionAfter) updateObj.conditionAfter = conditionAfter;
  } else if (status === process.env.BORROW_REQUEST_DAMAGE_CLAIM_STATUS) {
    const escrowTransactionRef = await db
      .collection(process.env.ESCROW_TRANSACTIONS_DOC)
      .where('requestId', '==', borrowRequestId)
      .get();

    const escrowTransactionId = escrowTransactionRef.docs[0].id;
    await updateEscrowTransaction(req.header('x-auth-token'), escrowTransactionId, 'Refunded');

    updateObj.status = status;
    if (conditionAfter) updateObj.conditionAfter = conditionAfter;

    const borrowerRef = await db
      .collection(process.env.USERS_DOC)
      .doc(borrowRequestData.borrowerId)
      .get();

    const itemRef = await db
      .collection(process.env.ITEMS_DOC)
      .doc(borrowRequestData.itemId)
      .get();

    const ownerRef = await db
      .collection(process.env.USERS_DOC)
      .doc(itemRef.data().ownerId)
      .get();

    await notifyDamageClaim(
      borrowerRef.data().email,
      borrowerRef.data().name,
      ownerRef.data().name,
      itemRef.data().itemName
    );
  }

  await borrowRequestRef.ref.update(updateObj);

  const updatedBorrowRequestData = (await borrowRequestRef.ref.get()).data();

  res.status(httpStatus.OK).json({
    id: borrowRequestRef.id,
    ...updatedBorrowRequestData,
  });
};

module.exports = updateBorrowRequest;
