const User = require('../models/usersModel.jsx');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const transporter = require('../emailConfig.jsx');
//user login controller
const userLogin = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ token });
    } catch (error) {
      console.error(error);
      next(error);
    }
  };

  // user register controllers

  const userRegister = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName,  lastName,  email,password,role } = req.body;

    try {
      const hashedPassword = await bcrypt.hash(password, 10); 
      const user = new User({ firstName,  lastName,  email,password:hashedPassword,role });
      await user.save();
      res.status(201).json({ message: 'user registered successfully' });
    } catch (error) {
      console.error(error);
      next(error);
    }
  };
  
  //fetching user role controllers
  const userRole = async (req, res, next) => {
    try {
      const user = await User.findById(req.user);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.json({ role: user.role });
    } catch (error) {
      console.error(error);
      next(error);
    }
  };

  //forget password controller
  const forgetPassword = async (req, res, next) => {
    const { email } = req.body;
    
  
    try {
      // Check if the email exists in the database
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Generate a password reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
  
      // Save the reset token and its expiration date to the user document in the database
      user.resetToken = resetToken;
      user.resetTokenExpiration = Date.now() + 3600000; // Token expires in 1 hour
      await user.save();
  
      // Send an email to the user with the reset token and instructions
      const resetPasswordLink = `http://localhost:5173/reset-password?token=${resetToken}`;
      const mailOptions = {
        from: 'fufawakgari174@gmail.com',
        to: email,
        subject: 'Password Reset',
        text: `Click the following link to reset your password: ${resetPasswordLink}`,
      };
  
      // Use your email sending logic to send the email with the resetPasswordLink
      await transporter.sendMail(mailOptions);
      res.json({ message: 'Password reset email sent successfully' });
    } catch (error) {
      console.error(error);
      next(error);
    }
  };

  //reset password 
  const resetPassword = async (req, res, next) => {
    const { token, newPassword } = req.body;
    
    try {
      // Find the user by the reset token and check if it's still valid
      const user = await User.findOne({
        resetToken: token,
        resetTokenExpiration: { $gt: Date.now() },
      });
  
      
  
      if (!user) {
        return res.status(400).json({ message: 'Invalid or expired token' });
      }
  
      if (!newPassword || newPassword.length < 6) {
        return res.status(400).json({ message: 'Invalid password. Password must be at least 6 characters long.' });
      }
  
      // Update the user's password and clear the reset token fields
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      user.resetToken = undefined;
      user.resetTokenExpiration = undefined;
      await user.save();
  
      res.json({ message: 'Password reset successfully' });
    } catch (error) {
      console.error(error);
      next(error);
    }
  };

  module.exports = {
    userLogin,
    userRegister,
    userRole,
    forgetPassword,
    resetPassword,
  };
