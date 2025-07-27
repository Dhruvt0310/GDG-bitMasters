//IMPORTS
//congif imports
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const body_parser = require('body-parser');
const cookie_parser = require('cookie-parser');
const app = express();
const session = require('express-session');
const PORT = 3000;








//--------------------ROUTES IMPORTS -----------------------------
//ash imports
// const authRoutes = require('./routes/authRoutes');
const calendarRoutes = require('./routes/calendarRoutes'); 
const trackRoutes = require('./routes/trackRoutes');




//shwets imports 












// END OF IMPORTS
// config
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174','http://localhost:3000', 'chrome-extension://*'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: true }));
app.use(cookie_parser());
app.use(session({
    secret: process.env.SESSION_SECRET  || 'cfb41d494e73ffde86c92e7555dc6821a3bc146280e87dd2e108b026f1a3066ef2eaf5a25a52c7009dc6887c20f0429c1cad23a2f7a2ba8ad9ca97049d6907ad',
    resave : false,
    saveUninitialized : true,
    cookie : {secure : false} //true while deployingggggg
}));


//db connection
mongoose.connect('mongodb://127.0.0.1:27017/HackSync').then(() => {
    console.log("Mongo connected to the HackSync DB!");
}).catch((err) => {
    console.error("Error", err);
});



// ash routes
// app.use('/api/auth', authRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api', trackRoutes);



//shwets routes 












//start
app.listen(PORT, () => {
    console.log("Server listening on 3000");
})