process.env.NODE_ENV = 'test';

const MongoClient = require('mongodb').MongoClient;
var db = require('../config/db');

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = "http://localhost:8081";
let should = chai.should();

let testID = '';

chai.use(chaiHttp);

describe('Notes', () => {

    // Get all the notes
    describe('/GET notes', () => {
        it('it should GET all the notes', (done) => {
            chai.request(server)
            .get('/notes')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                done();
            });
        });
    });
    
    // Try to post a wrong note, then a correct one. Save the ID of 
    //the created note in memory
    describe('/POST note', () => {
        it('it should not POST a note without body field', (done) => {
            let note = {
                test: "Test post 1"
            }
            chai.request(server)
            .post('/note')
            .set('content-type', 'application/x-www-form-urlencoded')
            .send(note)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('error');
                done();
            });
        });

        it('it should POST a note ', (done) => {
            let note = {
                body: "Test post 2"
            }
            chai.request(server)
            .post('/note')
            .set('content-type', 'application/x-www-form-urlencoded')
            .send(note)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('fav').eql(false);
                testID = res.body._id;
                done();
            });
        });
    });

    // Get a not favourited note given its ID
    describe('/GET/:id note', () => {
        it('it should GET a note by the given id', (done) => {
            chai.request(server)
            .get('/note/' + testID)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('_id').eql(testID);
                res.body.should.have.property('body');
                res.body.should.have.property('fav').eql(false);
                done();
            });
        });
    });

    // Favourite a note given its ID
    describe('/PATCH/:id fav a note', () => {
        it('it should PATCH a note to save it as favourite', (done) => {
            chai.request(server)
            .patch('/note/' + testID)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('ok').eql(1);
                done();
            });
        });
    });

    // Get all favourited notes
    describe('/GET favorited notes', () => {
        it('it should GET all the favourited notes', (done) => {
            chai.request(server)
            .get('/favnotes')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                done();
            });
        });
    });

    // Get a favourited note given its ID
    describe('/GET/:id note', () => {
        it('it should GET a note by the given id', (done) => {
            chai.request(server)
            .get('/note/' + testID)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('_id').eql(testID);
                res.body.should.have.property('body');
                res.body.should.have.property('fav').eql(true);
                done();
            });
        });
    });
       
    // Delete a note given its ID
    describe('/DELETE/:id note', () => {
        it('it should DELETE a note given the id', (done) => {
            chai.request(server)
            .delete('/note/' + testID)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('success').eql('Note ' + testID + ' deleted!');
                done();
            });
        });
    });
});