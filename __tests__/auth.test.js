/* eslint-disable no-undef, handle-callback-err, no-unused-vars */
const chai = require('chai');
const chaiHttp = require('chai-http');

const app = require('../src/app');

chai.use(chaiHttp);

const { expect } = chai;

describe('Authentications test', () => {
  let token = '';
  before((done) => {
    chai
      .request(app)
      .post('/api/auth/sign_up')
      .send({
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'password1'
      })
      .end((err, res) => {
        token = res.body.token;
        done();
      });
  });

  describe('Join Community test', () => {
    it('Should fail if id is invalid', (done) => {
      chai
        .request(app)
        .get(`/api/auth/join/communities/${1000}`)
        .set('authorization', `Bearer ${token}`)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.have.property('error').eql('Community with that ID is not in our database');
          done();
        });
    });

    it('Should pass if id is valid', (done) => {
      chai
        .request(app)
        .get(`/api/auth/join/communities/${3}`)
        .set('authorization', `Bearer ${token}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('token');
          expect(res.body).to.have.property('user');
          done();
        });
    });
  });

  describe('Join Association test', () => {
    it('Should fail if id is invalid', (done) => {
      chai
        .request(app)
        .get(`/api/auth/join/associations/${1000}`)
        .set('authorization', `Bearer ${token}`)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.have.property('error').eql('Association with that ID is not in our database');
          done();
        });
    });

    it('Should pass if id is valid', (done) => {
      chai
        .request(app)
        .get(`/api/auth/join/associations/${3}`)
        .set('authorization', `Bearer ${token}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('token');
          expect(res.body).to.have.property('user');
          done();
        });
    });
  });

  describe('Sign up', () => {
    it('Should fail if name is not provided', (done) => {
      chai
        .request(app)
        .post('/api/auth/sign_up')
        .send({
          name: '',
          email: 'emptyname@email.com',
          password: 'password1'
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('error').eql('Name cannot be empty');
          done();
        });
    });

    it('Should fail if email is invalid', (done) => {
      chai
        .request(app)
        .post('/api/auth/sign_up')
        .send({
          name: 'John Richman',
          email: 'wrongemailemail',
          password: 'password1'
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('error').eql('Invalid email address');
          done();
        });
    });

    it('Should fail to signup a user if password length is < 8', (done) => {
      chai
        .request(app)
        .post('/api/auth/sign_up')
        .send({
          name: 'John Richman',
          email: 'wrongemail@email.com',
          password: 'passord'
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('error').eql('Password length must be at least 8');
          done();
        });
    });

    it('Should pass if credentials are valid', (done) => {
      chai
        .request(app)
        .post('/api/auth/sign_up')
        .send({
          name: 'John Richman',
          email: 'wrongemail@email.com',
          password: 'password1'
        })
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.have.property('token');
          expect(res.body).to.have.property('user');
          done();
        });
    });

    it('Should fail if user exist already', (done) => {
      chai
        .request(app)
        .post('/api/auth/sign_up')
        .send({
          name: 'John Doe',
          email: 'johndoe@example.com',
          password: 'password1'
        })
        .end((err, res) => {
          expect(res).to.have.status(409);
          expect(res.body).to.have.property('error').eql('An account with that email exist already');
          done();
        });
    });
  });

  describe('Sign in tests', () => {
    it('Should fail email is invalid', (done) => {
      chai
        .request(app)
        .post('/api/auth/sign_in')
        .send({
          email: 'emaemail',
          password: 'password1'
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('error').eql('Wrong email/password combination');
          done();
        });
    });

    it('Should fail if user does not exist', (done) => {
      chai
        .request(app)
        .post('/api/auth/sign_in')
        .send({
          email: 'wronguser@email.com',
          password: 'password1'
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('error').eql('Wrong email/password combination');
          done();
        });
    });

    it('Should pass if if all credentials are valid', (done) => {
      chai
        .request(app)
        .post('/api/auth/sign_in')
        .send({
          email: 'johndoe@example.com',
          password: 'password1'
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('token');
          done();
        });
    });

    it('Should fail if passwords do not match', (done) => {
      chai
        .request(app)
        .post('/api/auth/sign_in')
        .send({
          email: 'wrongemail@email.com',
          password: 'passord'
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('error').eql('Wrong email/password combination');
          done();
        });
    });
  });
});
