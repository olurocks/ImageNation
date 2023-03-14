const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const mongoose = require('mongoose');
const errorHandler = require('errorhandler');
const MongoStore = require('connect-mongo')(session)


const dbString = 'mongodb://localhost/passport-tutorial'
const dbOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

const connection = mongoose.createConnection(dbString,dbOptions)
const sessionStore = new MongoStore({
    mongooseConnection: connection,
    colection:'sessions'
})

//Configure mongoose's promise to global promise
mongoose.promise = global.Promise;

//Configure isProduction variable
const isProduction = process.env.NODE_ENV === 'production';

//Initiate our app
const app = express();

//Configure our app
app.use(cors());
app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(require('./routes'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: "thisismysecretkeyandshouldn'tbeoutintheopen",
    saveUninitialized: true,
    resave: true,
}))

if (!isProduction) {
    app.use(errorHandler());
}

//Configure Mongoose
mongoose.connect('mongodb://localhost/passport-tutorial',{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>console.log("connected to mongodb")
.catch((err)=>console.error('error connecting to database')));

mongoose.set('debug', true);

//Error handlers & middlewares
if (!isProduction) {
    app.use((err, req, res, next) => {
        res.status(200).send('Hello, world!');

        res.json({
            errors: {
                message: err.message,
                error: err,
            },
        });
    });
}

app.use((err, req, res, next) => {
    res.status(200).send('Hero, world!');

    res.json({
        errors: {
            message: err.message,
            error: {},
        },
    });
});



// app.use(passport.initialize());
// app.use(passport.session());


// passport.use(new LocalStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

// mongoose.connect("mongodb://localhost/27017");
// mongoose.set('debug',true)
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
app.listen(8000, () => console.log('Server running on http://localhost:8000/'));
