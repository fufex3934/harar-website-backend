const express = require('express');
const router = express.Router();
const subscriberController = require('../controllers/subscribersController.jsx');

//create subscribers
router.post('/',subscriberController.createSubscriber);

//send updated news to subscribers
router.post('/news',subscriberController.updateNews);

module.exports = router;

