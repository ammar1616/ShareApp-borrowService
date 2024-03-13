const schedule = require('node-schedule');
const { db } = require('../startup/firebase');
const notifyDueDateApproaching = require('../helpers/notifyDueDateApproaching');

schedule.scheduleJob('0 0 * * *', async function () {
  console.log('Running scheduled job');

  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);

  try {
    const borrowRequestsRef = await db
      .collection('borrow_requests')
      .where('endDate', '>=', now)
      .where('endDate', '<=', tomorrow)
      .get();

    const borrowerIds = [];

    borrowRequestsRef.forEach((doc) => {
      const borrowRequestData = doc.data();
      console.log('Borrow Request ending within 24 hours:', borrowRequestData);

      const borrowerId = borrowRequestData.borrowerId;
      if (!borrowerIds.includes(borrowerId)) {
        borrowerIds.push(borrowerId);
      }
    });

    for (const id of borrowerIds) {
      const userRef = await db.collection('users').doc(id).get();
      if (userRef.exists) {
        notifyDueDateApproaching(userRef.data().email, userRef.data().name, '');
      }
    }
  } catch (error) {
    console.error('Error fetching borrow requests:', error);
  }
});
