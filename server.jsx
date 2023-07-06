require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { createClient } = require('@sanity/client');
const cors = require('cors');
const Subscriber = require('./models/subscribersModel.jsx');
const transporter = require('./emailConfig.jsx');

const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/harar';

//express app
const app = express();
const subscriberRouter = require('./routes/subscriberRouter.jsx');
const usersRouter = require('./routes/userRouter.jsx');
const adminsRouter = require('./routes/adminsRouter.jsx');
const feedbackRouter = require('./routes/feedbackRouter.jsx');
//middleware
app.use(express.json());
app.use(cors());
// Middleware to authenticate requests
 

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'An error occurred' });
};
//routes
app.use('/api/subscribe',subscriberRouter);
app.use('/users',usersRouter);
app.use('/admins',adminsRouter);
app.use('/feedback',feedbackRouter);



let previousNews = null;

// Function to check for news updates
async function checkNewsUpdates() {
  try {
    // Fetch the updated news from Sanity
    const sanity = createClient({
      projectId: process.env.SANITY_PROJECT_ID,
      dataset: process.env.SANITY_DATASET,
      apiVersion: process.env.apiVersion,
      useCdn: true,
    });

    const updatedNews = await sanity.fetch(`*[_type == "home"] | order(time desc) |  { title, slug }`);
    
    if (!previousNews || previousNews.slug.current !== updatedNews[0].slug.current) {
      // Get all subscribers
      const subscribers = await Subscriber.find();

      // Send update email to each subscriber
      for (const subscriber of subscribers) {
        const newsLink = `http://localhost:5173/news/${updatedNews[0].slug.current}`;

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

      previousNews = updatedNews[0];
    }
  } catch (error) {
    console.error('Error checking news updates:', error);
  }
}

// Schedule the interval function to check for updates every minute
setInterval(checkNewsUpdates, 60000);

//connect to db
mongoose.connect(MONGO_URI,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});
// Error handling middleware
app.use(errorHandler);
// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });