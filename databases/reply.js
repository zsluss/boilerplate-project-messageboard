let mongoose = require("mongoose")
const Schema = mongoose.Schema



let replySchema = new mongoose.Schema({
    text: String,
    created_on: { type: Date, default: new Date().toUTCString() },
    delete_password: String,
    reported: { type: Boolean, default: false }
});





module.exports = replySchema