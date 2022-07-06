const { check, validationResult } = require("express-validator")

const paymentValidateChainableApi = () => {
    return [
    check("ID")
        .exists()
        .withMessage("Transaction ID is required")
        .bail()
        .isNumeric()
        .withMessage('Transaction ID must be a number'),
    check("Amount")
        .exists()
        .withMessage("Transaction Amount is required")
        .bail()
        .isNumeric()
        .withMessage("Transaction Amount must be a number"),
    check("Currency")
        .exists()
        .withMessage("Currency is required")
        .bail()
        .isString()
        .withMessage("Currency must be a string"),
    check("CustomerEmail")
        .exists()
        .withMessage("CustomerEmail is required")
        .bail()
        .isEmail()
        .withMessage("CustomerEmail must be a valid email"),
    check("SplitInfo")
        .exists()
        .withMessage("SplitInfo is required")
        .bail()
        .notEmpty()
        .withMessage("SplitInfo must have an entity")
        .bail()
        .isArray({min: 1, max: 20})
        .withMessage( "Entities in SplitInfo must be at least one and not more than twenty"),        
]};

const validate = (req, res, next) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
      return next()
    }
    const extractedErrors = []
    errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))
  
    return res.status(400).json({
      errors: extractedErrors,
    })
  }

module.exports = { paymentValidateChainableApi, validate }
