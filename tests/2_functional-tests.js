const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');


chai.use(chaiHttp);
let testBoard = 'testing'
let deleteThread, deleteReply

suite('Functional Tests', function () {
    test('get request', function (done) {
        chai
            .request(server)
            .post('/api/threads/' + testBoard + '/')
            .send({
                board: testBoard,
                text: 'name',
                delete_password: 'delete'
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                done()
            });
    })

    test('get request for thread', function (done) {
        chai
            .request(server)
            .get('/api/threads/' + testBoard + '/')
            .send({
                board: testBoard
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                deleteThread = res.body[0]._id
                assert.equal(res.body[0].text, 'name');
                done();
            });
    })

    test('delete thread incorrect password', function (done) {
        chai
            .request(server)
            .delete('/api/threads/' + testBoard + '/')
            .send({
                board: testBoard,
                thread_id: deleteThread,
                delete_password: 'wrong'
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.text, 'incorrect password');
                done();
            });
    })

    test('put request for reporting thread', function (done) {
        chai
            .request(server)
            .put('/api/threads/' + testBoard + '/')
            .send({
                thread_id: deleteThread
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.text, 'reported');
                done();
            });
    })

    test('post reply request', function (done) {
        chai
            .request(server)
            .post('/api/replies/' + testBoard + '/')
            .send({
                board: testBoard,
                thread_id: deleteThread,
                text: 'name',
                delete_password: 'delete'
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                done()
            });
    })
    test('get request for reply', function (done) {
        chai
            .request(server)
            .get('/api/threads/' + testBoard + '/')
            .send({
                board: testBoard,
                thread_id: deleteThread
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                deleteReply = res.body[0].replies[0]._id
                assert.equal(res.body[0].text, 'name');
                done();
            });
    })
    test('delete reply incorrect password', function (done) {
        chai
            .request(server)
            .delete('/api/threads/' + testBoard + '/')
            .send({
                board: testBoard,
                thread_id: deleteThread,
                delete_password: 'wrong',
                reply_id: deleteReply
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.text, 'incorrect password');
                done();
            });
    })
    
    test('put request for reporting thread', function (done) {
        chai
            .request(server)
            .put('/api/threads/' + testBoard + '/')
            .send({
                thread_id: deleteThread,
                reply_id: deleteReply
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.text, 'reported');
                done();
            });
    })




    test('delete reply correct password', function (done) {
        chai
            .request(server)
            .delete('/api/threads/' + testBoard + '/')
            .send({
                board: testBoard,
                thread_id: deleteThread,
                delete_password: 'delete',
                reply_id: deleteReply
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.text, 'success');
                done();
            });
    })



    test('delete thread correct password', function (done) {
        chai
            .request(server)
            .delete('/api/threads/' + testBoard + '/')
            .send({
                board: testBoard,
                thread_id: deleteThread,
                delete_password: 'delete'
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.text, 'success');
                done();
            });
    })




});

after(function() {
    chai.request(server)
    .get('/')
  });
