const express = require('express');
const router = express.Router();
const event_controller = require('../controllers/eventcontroller');
const { body, param } = require('express-validator');
const validateInput = require('../middleware/validateinput');
const {create_validator,event_id_validator,user_id_validator}= require('../validators_input/eventvalidator');


router.post('/events',create_validator,validateInput,event_controller.createEvent);
router.get('/events/upcoming', event_controller.fetchUpcomingEvents);
router.get('/events/:id',event_id_validator,validateInput,event_controller.getEventDetails);
router.post('/events/:id/register', [event_id_validator,user_id_validator],validateInput,event_controller.registerEvent);
router.post('/events/:id/cancel', [event_id_validator,user_id_validator],validateInput,event_controller.cancelRegistration);
router.get('/events/:id/stats',event_id_validator,validateInput,event_controller.eventStat);

module.exports = router;