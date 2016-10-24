var logger = require('winston');
var server = require('../../app');
var chai = require('chai');
var chaiHttp = require('chai-http');
var seed = require('../../seed/seed');
var User = require('../../models/user');
var expect = require('chai').expect;

chai.should();
chai.use(chaiHttp);

var url = 'http://127.0.0.1:8001';


describe('Users', function() {

  // Before our test suite
  before(function(done) {
    // Start our app on an alternative port for acceptance tests
    server.listen(8001, function() {
      logger.info('Listening at http://localhost:8001 for acceptance tests');

      // Seed the DB with our users
      
      seed(function(err) {
        done(err);
      });
      
    });
  });

  describe('/GET users', function() {
    it('should return a list of users', function(done) {
      chai.request(url)
        .get('/api/users')
        .end(function(err, res) {
          res.body.should.be.a('object');
          res.should.have.status(200);
          expect(res.body.users.length).to.be.equal(100);
          //res.body.length.should.be.eql(100);
          done();
        });
    });
  });

  describe('/GET users/:id', function() {
    it('should return a single user', function(done) {
      // Find a user in the DB
      User.findOne({}, function(err, user) {
        var id = user._id;

        // Read this user by id
        chai.request(url)
          .get('/api/users/' + id)
          .end(function(err, res) {
            res.should.have.status(200);
            expect(res.body).to.be.a('object');
            expect(res.body.user.name.first).to.be.a('string');
            done();
          });
      });
    });
  });

  describe('/DELETE /:id', function(){
    it('should delete a specific user', function(done){
      //Find a user in the DB
      User.findOne({}, function(err, user){
        var id = user._id;

        chai.request(url)
          .delete('/api/users/' + id)
          .end(function(err, res){
            res.should.have.status(200);
            expect(res.body).to.be.a('object');
            expect(res.body.success).to.be.true;
            User.count({}, function(err_count, user_count){
              expect(user_count).to.equal(99);
              done();
            });
          });
      });
    });
  });

  describe('/PUT/:id', function(){
    it('should update a specific user', function(done){
      User.findOne({}, function(err, user){
        var id = user._id;

        chai.request(url)
          .put('/api/users/' + id)
          .send({first_name: 'LEANDRO',last_name: 'DOMINGUES'})
          .end(function(err, res){
            res.should.have.status(200);
            expect(res.body).to.be.a('object');
            expect(res.body.success).to.be.true;

            User.findOne({
              _id: id
            }, function(err_update, user_update){
              expect(user_update.name.first).to.be.equal('leandro');
              done();
            })
          })
      })
    });
  });

  describe('/POST/', function(){
    it('should insert a user', function(done){
      user = {
        gender: 'male',
        name: {
          first: 'leandro',
          last: 'domingues',
          title: 'mr'
        },
        location: {
          zip : 78058,
          state : "new york",
          city : "Nenagh",
          street : "3058 rochestown road"
        },
        email: 'delbussoweb@hotmail.com',
        username: 'delbussoweb',
        password: 'testpassword',
        salt: '',
        md5: '',
        sha1: '',
        sha256: '',
        registered: 2893937,
        dob: 12398498,
        phone: '+5511999599206',
        cell: '+5511999593635',
        PPS: '889399G',
        picture: {
          thumbnail : "https://randomuser.me/api/portraits/thumb/women/83.jpg",
          medium : "https://randomuser.me/api/portraits/med/women/83.jpg",
          large : "https://randomuser.me/api/portraits/women/83.jpg"
        }
      }

      chai.request(url)
        .post('/api/users/')
        .send(user)
        .end(function(err, res){
          res.should.have.status(200);
          expect(res.body).to.be.a('object');
          expect(res.body.success).to.be.true;
          console.log(res.body.user_id);
          User.count({}, function(err_count, user_count){
              expect(user_count).to.equal(100);
              done();
            });
        })
      
    })
  })
  
});
