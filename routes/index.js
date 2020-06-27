const express = require('express');
const passport = require('passport');
const router = express.Router();

const userController = require('../controllers/user_controller');

//use middleware to make profile page accessible only when user is signed in
router.get('/profile',passport.checkAuthentication, userController.profile);

router.get('/sign-up',userController.signUp);

router.get('/sign-in',userController.signIn);

router.get('/sign-out',userController.signOut);

router.post('/create-user',userController.createUser);

//use pass port as middleware to authenticate
router.post('/create-session',passport.authenticate(
    'local',
    {failureRedirect: '/sign-in'}
),userController.createSession);

module.exports = router;