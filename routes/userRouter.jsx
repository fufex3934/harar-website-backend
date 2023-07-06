const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const userController = require('../controllers/usersControllers.jsx');
const authenticateToken = require('../middlewares/authenticateToken.jsx');
//user login

router.post('/login',[
    body('email').isEmail(),
    body('password').notEmpty(),
  ],userController.userLogin);

  //user register
  router.post('/register',[
    body('firstName').notEmpty(),
    body('lastName').notEmpty(),
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
    body('role').notEmpty(),
  ],userController.userRegister);
  
  //fetching user role
  router.get('/role',authenticateToken,userController.userRole);

  //forget password
  router.post('/forgot-password',userController.forgetPassword);
  router.post('/reset-password',userController.resetPassword);

  module.exports = router;