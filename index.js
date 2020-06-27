const express = require('express');
const app = express();
const port = 8000;
const db = require('./config/mongoose');
const cookieParser = require('cookie-parser');

app.use(express.urlencoded());

app.use(cookieParser());


//use static files
app.use(express.static('./assets'));

//use express router
app.use('/',require('./routes/index'));

//set up the view engine
app.set('view engine','ejs');
app.set('views','./views');


app.listen(port,function(err){
    if(err){
        console.log(`Error in running server: ${err}`);
    }
    console.log(`Server is running on port: ${port}`);
});