const { body, param } = require('express-validator');

const validate_usr_details =   [
    body('name').notEmpty().withMessage('Name is required.'),
    body('email').isEmail().withMessage('Correct email is required.')
];

const user_id_validator = [
    param('id').isInt().withMessage('User id must be an integer.')
];

module.exports = {
    validate_usr_details,
    user_id_validator
};