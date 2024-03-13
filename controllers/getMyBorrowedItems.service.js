const httpStatus = require('http-status-codes').StatusCodes;
const { db } = require('../startup/firebase');

const getMyBorrowedItemsService = async (req, res) => {
  const borrowRequestRef = await db
    .collection(process.env.BORROW_REQUESTS_DOC)
    .where('borrowerId', '==', req.user.id)
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

module.exports = getMyBorrowedItemsService;
