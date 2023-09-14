let mongoose = require("mongoose")
const Schema = mongoose.Schema
var replySchema = require('../databases/reply.js')

let threadSchema = new mongoose.Schema({
    board: { type: String},
    text: { type: String },
    created_on: { type: Date, default: new Date().toUTCString() },
    reported: { type: Boolean, default: false },
    bumped_on: { type: Date, default: new Date().toUTCString() },
    delete_password: { type: String },
    replies: [replySchema]
});





module.exports = mongoose.model('Thread', threadSchema)