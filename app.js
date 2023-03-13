const express = require('express');
const path = require('path')
const mongoose = require('mongoose');
// const passportLocalMongoose = require('passport-local-mongoose');
// const User = require('./models/User');
const app = express();
const session = app.require('express-session')
const Passport = require('./config/passport')
const errorHandler = require('errorhandler');
const isProduction = process.env.NODE_ENV === 'production';
const cors = require('cors');

mongoose.promise = global.promise




app.use(express.urlencoded({extended: false}));
app.use(express.static('static'))
app.use(cors())

app.use(session({
    secret:"thisismysecretkeyandshouldn'tbeoutintheopen",
    saveUninitialized: true,
    resave: true,
}))

app.use(passport.initialize());
app.use(passport.session());


// passport.use(new LocalStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

mongoose.connect("mongodb://localhost/27017");
mongoose.set('debug',true)
app.get('/',(req,res)=>{
    res.sendFile(__dirname +'/static/index.html')
})

app.get('/login', (req,res)=>{
    res.sendFile(__dirname + '/static/login.html')
})

app.post('/login',(req,res)=>{
    // let username = req.body.username;
    let email = req.body.email;
    let password = req.body.password;
    res.send(`Password: ${password} Email: ${email}`);
})

const port = 3000
app.listen(port, () => console.log(`this app is listening on port ${port}`));