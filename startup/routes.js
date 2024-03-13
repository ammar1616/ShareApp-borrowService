const express = require('express');
require('express-async-errors');
const cors = require('cors');
const borrowRequest = require('../routes/borrowRequest.route');
const error = require('../middlewares/error');

module.exports = (app) => {
  app.use(express.json());
  app.use(cors({ origin: true }));
  app.use('/borrow-service', borrowRequest);
  app.use(error);
};
