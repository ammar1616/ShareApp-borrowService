const Joi = require('joi');

function validateBorrowRequest(borrowRequest) {
  const borrowRequestSchema = Joi.object({
    itemId: Joi.string().required(),
    startDate: Joi.string().required(),
    endDate: Joi.string().required(),
    conditionBefore: Joi.string().optional(),
    conditionAfter: Joi.string().optional(),
  });

  return borrowRequestSchema.validate(borrowRequest);
}

module.exports = validateBorrowRequest;
