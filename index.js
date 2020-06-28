const express = require('express');
const app = express();
const port = 8000;
const db = require('./config/mongoose');
const cookieParser = require('cookie-parser');

//used for session cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport_local_strategy');
const passportGoogle = require('./config/passport_google_oauth2_strategy');
const MongoStore = require('connect-mongo')(session);
const crypto = require('crypto');

const flash = require('connect-flash');
const customMiddleware = require('./config/middleware');

const bcrypt = require('bcrypt');

app.use(express.urlencoded());


app.use(cookieParser());


//use static files
app.use(express.static('./assets'));

//set up the view engine
app.set('view engine','ejs');
app.set('views','./views');

app.use(session({
    name: 'Auth_System',

    //key used for encryption
    secret: crypto.randomBytes(20).toString('hex'),
    saveUninitialized: false,
    resave: false,
    cookie:{
        maxAge: 1000*60*10 //10 minutes
    },
    //use mongo-store to store the session cookie in the DB
    store: new MongoStore({
        mongooseConnection: db,
        autoRemove: 'disabled'
    },function(err){
        console.log(err || 'Connect mongodb set up');
    })
}));

app.use(passport.initialize());
app.use(passport.session());
 
app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMiddleware.setFlash);

//use express router
app.use('/',require('./routes/index'));

app.listen(port,function(err){
    if(err){
        console.log(`Error in running server: ${err}`);
    }
    console.log(`Server is running on port: ${port}`);
});