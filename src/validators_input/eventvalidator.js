const { body, param } = require('express-validator');

const create_validator = [
  body('title')
    .notEmpty()
    .withMessage('Event title is required.'),

  body('date_time')
    .notEmpty()
    .withMessage('Event date & time is required.')
    .isISO8601()
    .withMessage('Event date & time must be in format (YYYY-MM-DDTHH:MM:SSZ).'),

  body('location')
    .notEmpty()
    .withMessage('Event location is required.'),

  body('capacity')
    .isInt({ min: 1, max: 1000 })
    .withMessage('Event capacity must be a whole number between 1 and 1000.')
];

const event_id_validator = [
  param('id')
    .isInt()
    .withMessage('The event id must be a valid integer.')
];

const user_id_validator = [
  body('userId')
    .isInt()
    .withMessage('The user id must be a valid integer.')
];

module.exports = {
    create_validator,
    event_id_validator,
    user_id_validator
};