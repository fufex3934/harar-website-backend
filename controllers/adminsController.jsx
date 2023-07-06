const User = require('../models/usersModel.jsx');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

//fetch admins controller for dashboard page
const admins = async (req, res, next) => {
    try {
      const admins = await User.find({ role: { $in: ['sub-admin', 'super-admin'] } });
      res.json({ admins });
    } catch (error) {
      console.error(error);
      next(error);
    }
  };

  //update admin controller
  const updateAdmin = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { id } = req.params; // Extract the admin ID from the request parameters
      const { firstName, lastName, email, password, role } = req.body; // Extract the updated admin data from the request body

      // Find the admin in the database by ID
      const admin = await User.findById(id);

      if (!admin) {
        return res.status(404).json({ error: 'Admin not found' });
      }

      // Update the admin's properties with the new values
      admin.firstName = firstName;
      admin.lastName = lastName;
      admin.email = email;
      admin.password = await bcrypt.hash(password, 10); // Hash the new password
      admin.role = role;

      // Save the updated admin to the database
      await admin.save();

      res.status(200).json({ message: 'Admin updated successfully' });
    } catch (error) {
      console.error(error);
      next(error);
    }
  };

  //delete admin
 const deleteAdmin = async (req, res, next) => {
    try {
      const { id } = req.params; // Extract the admin ID from the request parameters
  
      // Delete the admin from the database
      const result = await User.deleteOne({ _id: id });
  
      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Admin not found' });
      }
  
      res.status(200).json({ message: 'Admin deleted successfully' });
    } catch (error) {
      console.error(error);
      next(error);
    }
  };

  module.exports = {
    admins,
    updateAdmin,
    deleteAdmin,
  };