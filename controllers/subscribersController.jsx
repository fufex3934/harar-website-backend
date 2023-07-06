const Subscriber = require('../models/subscribersModel.jsx');
const transporter = require('../emailConfig.jsx');
const { createClient } = require('@sanity/client');
//create subscribers
 const createSubscriber = async (req, res) => {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required!' });
    }
  
    try {
      // Check if the subscriber already exists
      const existingSubscriber = await Subscriber.findOne({ email });
  
      if (existingSubscriber) {
        return res.status(400).json({ error: 'Email already subscribed!' });
      }
  
      // Create a new subscriber
      const newSubscriber = new Subscriber({ email });
      await newSubscriber.save();
  
      // Send confirmation email
      const mailOptions = {
        from: 'fufawakgari174@gmail.com',
        to: email,
        subject: 'Subscription Confirmation',
        text: 'Thank you for subscribing to our Website!',
      };
  
      await transporter.sendMail(mailOptions);
  
      res.json({ message: 'Successfully subscribed to the newsletter!' });
    } catch (error) {
      console.error('Error subscribing to the newsletter:', error);
      res.status(500).json({ error: 'An error occurred while subscribing to the newsletter.' });
    }
  };
  
  //send news update to subscribers
  const updateNews = async (req, res) => {
    try {
      // Fetch the updated news from Sanity
      const sanity = createClient({
        projectId: process.env.SANITY_PROJECT_ID,
        dataset: process.env.SANITY_DATASET,
        apiVersion: process.env.apiVersion,
        useCdn: true,
      });
  
      const updatedNews = await sanity.fetch(`*[_type == "home"] | order(time desc) | [0] { title, slug }`);
      
  
      // Get all subscribers
      const subscribers = await Subscriber.find();
  
      // Send update email to each subscriber
      for (const subscriber of subscribers) {
        const newsLink = `/news/${updatedNews.slug}`; // Replace with your actual news URL
  
        const mailOptions = {
          from: 'fufawakgari174@gmail.com',
          to: subscriber.email,
          subject: 'News Update',
          html: `
            <h3>Here is the updated news:</h3>
            <h2>${updatedNews[0].title}</h2>
            <a href="${newsLink}">Read More</a>
          `,
        };
  
        await transporter.sendMail(mailOptions);
      }
  
      res.json({ message: 'Successfully sent news update to subscribers!' });
    } catch (error) {
      console.error('Error sending news update:', error);
      res.status(500).json({ error: 'An error occurred while sending the news update.' });
    }
  };
  module.exports = {
    createSubscriber,
    updateNews,
  }