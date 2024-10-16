//express downloading code
const express = require('express');
const app = express();

// use cross origin for frontend-backend communication
const cors = require('cors'); // calling cross origin library
app.use(cors()); // creating object of cors library
app.use(express.json());

//database connection code start
const mongoose = require('mongoose'); // importing mongodb compiler
mongoose.connect('mongodb://127.0.0.1:27017/weatherupdates', {
  useNewUrlParser: true,
});
//passing the url of database
// use ip address instead of domain name localhost:27017

const db = mongoose.connection; //connection to db
db.on('error', (error) => console.log(error)); // if error than show error
db.on('open', () => console.log(' Database Connected... ')); // otherwise show Database Connected
// database connection code end

const Weather = require('./api/weatherapi');   
app.use('/weather', Weather); // http://localhost:8000/rules - post

app.listen(8000, () => console.log('The server is live now....'));
