const { validationResult } = require('express-validator');

const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: 'Validation failed.',
            details: errors.array().map(({ path, msg }) => ({ field: path, message: msg })),
        });
    }
    next();
};

const requiredText = (field, label, max = 300) =>
    require('express-validator').body(field)
        .trim()
        .notEmpty().withMessage(`${label} is required.`)
        .isLength({ max }).withMessage(`${label} is too long.`);

const optionalText = (field, max = 500) =>
    require('express-validator').body(field)
        .optional({ values: 'falsy' })
        .trim()
        .isLength({ max }).withMessage(`${field} is too long.`);

const positiveId = (field = 'id') =>
    require('express-validator').param(field)
        .isInt({ min: 1 }).withMessage(`${field} must be a positive integer.`)
        .toInt();

const paginationRules = (defaultLimit = 20) => [
    require('express-validator').query('page').optional().isInt({ min: 1 }).withMessage('page must be a positive integer.').toInt(),
    require('express-validator').query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('limit must be between 1 and 100.').toInt(),
];

module.exports = { validateRequest, requiredText, optionalText, positiveId, paginationRules };
