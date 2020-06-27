const User = require('../models/user');

//render profile page
module.exports.profile = function(req,res){
    return res.render('profile',{
        title: "Profile",
    })
}

//render the Sign up page
module.exports.signUp = function(req,res){

    //if a user is authenticated(logged in), sign up page cannot be accessed
    if(req.isAuthenticated()){
        return res.redirect('/profile');
    }

    return res.render('user_sign_up',{
        title: "Sign up"
    })
};

//render the Sign in page
module.exports.signIn = function(req,res){

    //if a user is authenticated(logged in), sign in page cannot be accessed
    if(req.isAuthenticated()){
        return res.redirect('/profile');
    }
    
    return res.render('user_sign_in',{
        title: "Sign in"
    })
};

//get the sign up data
module.exports.createUser = function(req,res){

    //if Password and Confirm Password doesn't match redirect to Sign up page
    if(req.body.password != req.body.confirm_password){
        
        return res.redirect('back');
    }

     //if Password and Confirm Password doesn't matches, check if email id already exists in DB

    User.findOne({email: req.body.email}, function(err,user){
        if(err){
            console.log(`Error in finding user during Sign up: ${err}`);
            return;
        }

        //If email doesn't exist in DB, create a new user and redirect to Sign in page
        if(!user){
            User.create(req.body, function(err,user){
                if(err){
                    console.log(`Error in creating user during Sign up: ${err}`);
                    return;
                }
                return res.redirect('/sign-in');
            })
        }
        
        //If email already exists in DB, redirect to Sign up page
        else{
            return res.redirect('back');
        }
    })
};

//get the sign in data
module.exports.createSession = function(req,res){
    
    return res.redirect('/profile');
};


//sign out user
module.exports.signOut = function(req,res){
    req.logout();
    req.flash('success','Logged out');
    return res.redirect('/sign-in');
}