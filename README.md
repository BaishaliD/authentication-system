# authentication-system

This is a general authentication system that can be used in any web application.
Passport.js has been used for authentication.

## How to use

1. Clone this repository
2. Navigate to the project directory in the terminal
3. Install MongoDB and NodeJS
4. Create a .env file and include the environment variables as mentioned in the .env_sample file (To generate your Google oauth 2.0 credentials, visit <https://developers.google.com/identity/protocols/oauth2>)
5. In user_sign_in.ejs file, replace the value of the 'data-sitekey' field of the form with the Site key for your reCAPTCHA (Visit <https://www.google.com/recaptcha/intro/v3.html> to generate your own reCAPTCHA credentials)
6. Run the following command from the directory to install all the required packages 

  `npm install`  
7. To start the server, run the following command
  
  `npm start`  

8. In your browser, open <http://localhost:YOUR-PORT-NUMBER/sign-in> to view the Home page

## Features

![Image 1](assets/images/bg-image.jpg)

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
