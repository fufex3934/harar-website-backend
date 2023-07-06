const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authenticateToken.jsx');
const adminsController = require('../controllers/adminsController.jsx');
const { body, validationResult } = require('express-validator');
//fetch admins
router.get('/',authenticateToken,adminsController.admins);

//update admin
router.get('/:id',[
    body('firstName').notEmpty(),
    body('lastName').notEmpty(),
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
    body('role').notEmpty(),
  ],adminsController.updateAdmin);
  
  //delete admin
  router.delete('/:id',adminsController.deleteAdmin);
  //update admin
  router.put('/:id',adminsController.updateAdmin);


module.exports = router;