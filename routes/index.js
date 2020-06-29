const express = require('express');
const passport = require('passport');
const router = express.Router();
const userController = require('../controllers/user_controller');


//render the sign in page
router.get('/sign-in', userController.signIn);


//use middleware to make profile page accessible only when user is signed in
router.get('/profile', passport.checkAuthentication, userController.profile);


//render the Sign up page
router.get('/sign-up', userController.signUp);
//create a new account, i.e, sign up the user
router.post('/create-user', userController.createUser);


//sign out user
router.get('/sign-out', userController.signOut);
//sign out user after successfully changing the password
router.get('/password-changed', userController.passwordChanged);


//create a new session using local authentication, Use passport as middleware to authenticate user
router.post('/create-session', passport.authenticate(
    'local',
    { failureRedirect: '/sign-in' }
), userController.createSession);


//create a new session using Google oauth 2.0
router.get('/auth/google', passport.authenticate(
    'google',
    { scope: ['profile', 'email'] ,
    prompt: 'select_account'}
));

router.get('/auth/google/callback', passport.authenticate(
    'google',
    { failureRedirect: '/sign-in' }
), userController.createSession);


//update password in DB when user changes password from the Profile page
router.post('/update-password-profile',userController.updatePasswordProfile);




//PASSWORD RECOVERY

//Render the page that sends the recover password email
router.get('/recover-password', userController.recoverPassword);

//Send a password recovery mail to the email address of the user
router.post('/send-recovery-mail', userController.sendRecoveryMail);

//Update password in database when user changes it using the recovery email
router.post('/update-password-recovery', userController.updatePasswordRecovery);

//Render the page to set a new password
router.get('/reset', userController.renderResetPage);





module.exports = router;