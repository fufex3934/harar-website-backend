const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController.jsx');
const { body, validationResult } = require('express-validator');
router.post('/',[
    body('name').notEmpty(),
    body('email').isEmail(),
    body('comment').notEmpty(),
  ],feedbackController.createFeedback);

  //fetching feedbacks
  router.get('/comments',feedbackController.fetchFeedbacks);
  router.post('/reply',feedbackController.replyFeedback);

module.exports = router;