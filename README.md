# authentication-system

This is a geenral authentication system that can be used in any web application.
Passport.js has been used for authentication.

## How to use

1. Clone this repository
2. Navigate to the project directory
3. Install MongoDB and npm
4. Run the following commands from the directory  

  `npm install`  
  
  `npm start`  

5. In your browser, open localhost:8000/sign-in to view the Home page

## Features

### Sign in

Authentication used : 
1. local authentication
2. Google oauth 2.0

The user can either Sign in using his existing Google accounts, or can create a new account with an existng email id.

Google Recaptcha V2 has been used for verification during Sign in.

### Profile page
Here, the user can view the email id and the Username.
The user can change his password from this page.

### Account recovery

If the user forgets his password, he can ask for a recovery email.

An email will be sent to the user's email account, containing a link to reset the password.

This link will expire in 10 minutes.
