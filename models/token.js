const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    emailId: {
        type: String
    },
    access_token: {
        type: String,
        expires: 60
    }
},{
        timestamps: true

});

const token = mongoose.model('Token',tokenSchema);
module.exports = token;
