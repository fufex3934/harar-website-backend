const Feedback = require('../models/feedbackModel.jsx');
const { body, validationResult } = require('express-validator');
const transporter = require('../emailConfig.jsx');
//create feedback
const createFeedback = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name,  email,  comment } = req.body;

    try {
      
      const feedback = new Feedback({ name,  email,  comment });
      await feedback.save();
      res.status(201).json({ message: 'feedback registered successfully' });
    } catch (error) {
      console.error(error);
      next(error);
    }
  };

  //fetching feedbacks
  const fetchFeedbacks = async (req, res, next) => {
    try {
      const feedbacks = await Feedback.find();
      res.json({ feedbacks });
    } catch (error) {
      console.error(error);
      next(error);
    }
  };

  //replying feedback
  const replyFeedback = async (req,res,next)=>{
    try{
     const { email, replyText } = req.body;
     const mailOptions = {
       from: 'fufawakgari174@gmail.com',
       to: email,
       subject: 'Feedback Reply from Harari Government Communication Affairs Office Website',
       text: `${replyText}`,
     };
 
     await transporter.sendMail(mailOptions);
     res.json({ message: 'Successfully FeedBack is Replied !' });
    }catch(error){
     console.log(error);
     res.status(500).json({ error: 'An error occurred while Reply the feedback' });
     next(error);
    }
 };

  module.exports = {
    createFeedback,
    fetchFeedbacks,
    replyFeedback,
  }