const express = require('express');
const authentication = require('../middlewares/authentication.js');
const addBorrowRequestService = require('../controllers/addBorrowRequest.service.js');
const getMyBorrowedItemsService = require('../controllers/getMyBorrowedItems.service.js');
const getMyLentItemsService = require('../controllers/getMyLentItems.service.js');
const updateMyBorrowRequestService = require('../controllers/updateBorrowRequest.service.js');
const router = express.Router();

router.post('/',authentication, addBorrowRequestService);
router.get('/borrowed',authentication, getMyBorrowedItemsService);
router.get('/lent', authentication,getMyLentItemsService);
router.patch('/:id',authentication, updateMyBorrowRequestService);

module.exports = router;