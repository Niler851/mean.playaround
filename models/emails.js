//models/user.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EmailSchema = new Schema({
    from: String,
    to: String,
    sent_at:{ type: Date, default: Date.now },
    subject: String,
    message: String
});

module.exports = mongoose.model('Emails', EmailSchema);