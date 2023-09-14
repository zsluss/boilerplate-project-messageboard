'use strict';
require('dotenv').config();
let mongoose = require("mongoose")
const mySecret = process.env['MONGO_URI']
const Schema = mongoose.Schema
const bcrypt = require('bcrypt');
const { text } = require('body-parser');
const saltRounds = 12;
var replySchema = require('../databases/reply.js')
var Thread = require('../databases/thread.js')

mongoose.connect(mySecret, { useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.on('error', console.error.bind(console, 'connection error:'));
connection.once('open', () => {
  console.log("Connection established!")
})



let Reply = mongoose.model('Reply', replySchema)

module.exports = function (app) {

  app.route('/api/threads/:board')
    .post(async (req, res) => {
      console.log("POST THREADS", req.body)
      let create = new Thread(req.body)
      if (!create.board || create.board == "") {
        create.board = req.params.board
      }
      create.created_on = new Date()
      create.bumped_on = create.created_on
      await create.save()
        .then((data) => {
          res.redirect('/b/' + data.board + '/')  //('/api/threads/' + data.board)
        })
    })
    .get(async (req, res) => {
      let foundThread = await Thread.find({ board: req.params.board })
        .sort({ bumped_on: -1 })
        .limit(10)
        .select({
          delete_password: 0,
          reported: 0
        })
        .lean()
        .then((data) => {
          data.forEach((thread) => {
            thread['replycount'] = thread.replies.length
            thread.replies.sort((thread1, thread2) => {
              return thread2.created_on - thread1.created_on
            })
            thread.replies = thread.replies.slice(0, 3)
            thread.replies.forEach((reply) => {
              reply.delete_password = undefined
              reply.reported = undefined
            })
          })
          return res.json(data)
        })
    })
    .delete(async (req, res) => {
      await Thread.findById(req.body.thread_id)
        .then((data => {
          if (req.body.delete_password == data.delete_password) {
            Thread.deleteOne({ thread_id: data.thread_id })
            return res.send("success")
          }
          else {
            return res.send('incorrect password')
          }
        }))
    })

    .put(async (req, res) => {
      let report = await Thread.updateOne({
        "threads._id": req.body.thread_id
      },
        {
          $set: {
            'reported': true
          }
        })
      return res.send('reported')
    })


  app.route('/api/replies/:board')
    .get(async (req, res) => {
      let foundReplies = await Thread.findById(req.query.thread_id)
        .then((data) => {
          data.delete_password = undefined
          data.reported = undefined
          data['replycount'] = data.replies.length
          data.replies.sort((thread1, thread2) => {
            return thread2.created_on - thread1.created_on
          })
          data.replies.forEach((rep) => {
            rep.delete_password = undefined
            rep.reported = undefined
          })
          res.json(data)
        })
    })

    .post(async (req, res) => {
      let create = new Reply(req.body);
      create.created_on = new Date()
      let board = req.body.board
      if (!board || board == "") {
        board = req.params.board
      }
      let update = await Thread.findOneAndUpdate({ _id: req.body.thread_id },
        {
          $push: { replies: create },
          bumped_on: create.created_on
        },
        { new: true },)


      res.redirect('/b/' + board + "/" + req.body.thread_id)
    })

    .delete(async (req, res) => {
      let update = await Thread.updateOne({
        _id: req.body.thread_id,
        "replies._id": req.body.reply_id,
        "replies.delete_password": req.body.delete_password
      },
        { $set: { 'replies.$.text': '[deleted]' } },
      )
      if (update.modifiedCount == 1) {
        return res.send("success")
      }
      else {
        return res.send("incorrect password")
      }
    }
    )

    .put(async (req, res) => {
      let report = await Thread.updateOne({
        _id: req.body.thread_id,
        "replies._id": req.body.reply_id,
//        "replies.delete_password": req.body.delete_password
      },
        {
          $set: {
            'replies.$.reported': true
          }
        }
      )
      return res.send('reported')
    })


};
