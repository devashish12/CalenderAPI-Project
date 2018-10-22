const fs = require('fs');
const express=require('express');
const mongoose=require('mongoose');
const readline = require('readline');
const {google} = require('googleapis');
const {CalanderSchema,CalenderUser}=require('./models/calenderSchema');
const {event}=require('./models/events');
const _=require('lodash');

var app=express();
app.use(express.json());

mongoose.connect('mongodb://localhost/apiCalander')
.then(()=>console.log("connected to mongodb"))
.catch(errror=>console.log("error",errror.message));
//mongoose connection end


const SCOPES = ['https://www.googleapis.com/auth/calendar'];///*.readonly*/
const TOKEN_PATH = 'Date2.json';
app.get('/',async (req,res)=>{
  const calendar=await CalenderUser.find().sort({date:1}).select({date:1,event:1});
  
  res.send(calendar);
})



fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  authorize(JSON.parse(content), listEvents);
});


function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getAccessToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}


function getAccessToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}


async function listEvents(auth) {
  const calendar = google.calendar({version: 'v3', auth});
  calendar.events.list({
    calendarId: 'primary',
    timeMin: (new Date()).toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const events = res.data.items;
    if (events.length) {
      console.log('Upcoming 10 events:');
      events.map(async (event, i)  => {
        const start = event.start.dateTime || event.start.date;
        console.log(`${start} - ${event.summary}`);
        const calender=new CalenderUser({
          date:start,
          event:event.summary
        })
        const result=await calender.save();
        
        // console.log("start",start);
        // console.log("event",event.summary);
      });
    } else {
      console.log('No upcoming events found.');
    }
  });
  calendar.events.insert({
    auth: auth,
    calendarId: 'primary',
    resource: event,
  }, function(err, event) {
    if (err) {
      console.log('There was an error contacting the Calendar service: ' + err);
      return;
    }
    console.log('Event created: %s', event.htmlLink);
  });
}

app.listen(3000);