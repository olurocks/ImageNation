const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const flash = require('connect-flash');
const errorHandler = require('errorhandler');
const dotenv = require('dotenv')
const uuid = require('uuid')
const WebSocket =require('ws')
const socket = new WebSocket.Server({ port: 8080 });

dotenv.config({ path: './.env' })
const mysql = require('mysql')


const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_ROOT,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
})

socket.on('open', ()=>{
    console.log('socket connected to server')
})
db.query('SELECT 1', (error) => {
    if (error) {
        console.log(error)
    } else {
        console.log("Mysql connected")
    }

})


//Configure isProduction variable
const isProduction = process.env.NODE_ENV === 'production';

//Initiate our app
const app = express();
// Set up flash messages middleware

//Configure our app
app.use(cors());
app.set('view engine','ejs')
app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
require('./models/User');
app.use(flash());
app.use(express.static(path.join(__dirname, 'views')));
app.use(session({
    secret: "thisismysecretkeyandshouldn'tbeoutintheopen",
    saveUninitialized: true,
    resave: true,
}))

if (!isProduction) {
    app.use(errorHandler());
}
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
    console.log("what's this line do")

    res.json({
        errors: {
            message: err.message,
            error: {},
        },
    });
});

app.get('/',(req,res)=>{
    res.render(__dirname +'/views/index')
})

app.get('/login', (req,res)=>{
    res.render('login', {messages: ''})
})

app.post('/login',(req,res)=>{
    // let username = req.body.username;
    let email = req.body.email;
    let password = req.body.password;
    res.send(`Password: ${password} Email: ${email}`);
})

app.post('/signup', (req, res) => {
    const { name, email, username, password } = req.body;
    const userId = uuid.v4();
    const User = {name, email, username, password, userId}

    db.query('SELECT * FROM users where email = ?', email, (error,results)=>{
        if (results.length > 0) {
            const user = results[0];
            if (user.email === email) {
            console.log("email already exists")
            const message = "email already exists please sign in instead";
            socket.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ message }));
                }
                
            });
            } else {
                console.log('not email')
            }
        } else {
            db.query('INSERT into users SET ?',User,(error, results)=>{
                if (error){
                    console.log(error)
                    res.status(500).json({ error: "Internal server error" });
                }else{
                    const message = "Signup successful. Please log in to continue";
                    wss.clients.forEach((client) => {
                        if (client.readyState === WebSocket.OPEN) {
                            client.send(JSON.stringify({ message }));
                    }
                });
            }
        });
    }

})


})

    // Check if email already exists

app.listen(7000, () => console.log('Server running on http://localhost:7000/'));
