const express = require('express');
const passport = require('passport');
const router = express.Router();

const userController = require('../controllers/user_controller');

//use middleware to make profile page accessible only when user is signed in
router.get('/profile', passport.checkAuthentication, userController.profile);

router.get('/sign-up', userController.signUp);

router.get('/sign-in', userController.signIn);

router.get('/forgot-password',userController.forgotPassword);

//sign out user
router.get('/sign-out', userController.signOut);

//sign out user after successfully changing the password
router.get('/password-changed', userController.passwordChanged);

router.post('/create-user', userController.createUser);

//use pass port as middleware to authenticate
router.post('/create-session', passport.authenticate(
    'local',
    { failureRedirect: '/sign-in' }
), userController.createSession);


router.get('/auth/google', passport.authenticate(
    'google',
    { scope: ['profile', 'email'] ,
    prompt: 'select_account'}
));

//callback for google oauth 2
router.get('/auth/google/callback', passport.authenticate(
    'google',
    { failureRedirect: '/sign-in' }
), userController.createSession);

//reset password

router.get('/forgot-password', userController.forgotPassword);

router.post('/reset-password', userController.resetPassword);

router.get('/reset', userController.renderResetPage);

router.post('/forgot-password-reset', userController.forgotPasswordReset);


//update password in db

router.post('/update-db',userController.updateDB);



module.exports = router;