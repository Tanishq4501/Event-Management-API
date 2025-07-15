const express = require('express');
const router = express.Router();
const user_controller = require('../controllers/usercontroller');
const {validate_usr_details,user_id_validator} = require('../validators_input/uservalidator');
const validateInput = require('../middleware/validateinput');


router.post('/users',validate_usr_details,validateInput,user_controller.createUser);
router.get('/users',user_controller.getAllUser);
router.get('/users/:id',user_id_validator,validateInput,user_controller.getUser);


module.exports = router;