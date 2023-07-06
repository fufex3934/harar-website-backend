require('dotenv').config();
const { google } = require('googleapis');
const nodemailer = require('nodemailer');


// Configure Nodemailer with OAuth 2.0
const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URL
  );
  
  oauth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN,
  });
  
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      type: 'OAuth2',
      user: 'fufawakgari174@gmail.com',
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN,
      accessToken: oauth2Client.getAccessToken(),
    },
  });

  module.exports = transporter;