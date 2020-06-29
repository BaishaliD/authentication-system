const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    emailId: {
        type: String
    },
    access_token: {
        type: String,
        expires: 60
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
        index: { expires: '1m' }
      }
},{
    
        timestamps: true

});

const token = mongoose.model('Token',tokenSchema);
module.exports = token;
