const httpStatus = require('http-status-codes').StatusCodes;
const { db } = require('../startup/firebase');

const getMyLentItemsService = async (req, res) => {
  const userItemsSnapshot = await db
    .collection(process.env.ITEMS_DOC)
    .where('ownerId', '==', req.user.id)
    .get();

  const userItemIds = userItemsSnapshot.docs.map((doc) => doc.id);

  if (userItemIds.length == 0) {
    return res
      .status(httpStatus.NOT_FOUND)
      .json({ error: 'Items not found for the user' });
  }

  const borrowRequestRef = await db
    .collection(process.env.BORROW_REQUESTS_DOC)
    .where('itemId', 'in', userItemIds)
    .get();

  if (borrowRequestRef.empty) {
    return res
      .status(httpStatus.NOT_FOUND)
      .json({ error: 'Borrow Requests not found for the user' });
  }

  const borrowRequestsData = borrowRequestRef.docs.map(async (doc) => {
    const borrowData = doc.data();
    const itemId = borrowData.itemId;

    const itemSnapshot = await db
      .collection(process.env.ITEMS_DOC)
      .doc(itemId)
      .get();
    if (!itemSnapshot.exists) {
      return { id: doc.id, ...borrowData, item: null };
    }

    const itemData = itemSnapshot.data();
    return { id: doc.id, ...borrowData, item: itemData };
  });

  const borrowedItems = await Promise.all(borrowRequestsData);

  res.status(httpStatus.OK).json(borrowedItems);
};

module.exports = getMyLentItemsService;
