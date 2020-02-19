const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = require('chai').assert;
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/training3', {useNewUrlParser: true, useUnifiedTopology: true});

const app = require('../app');
const UserModel = require('../models/Users');
const testUserArrays = require('./testUserArrays');

chai.use(chaiHttp);

async function addUserFromArray(array) {
  array.forEach(async user => {
    try {
      const responsePost = await chai
                                  .request(app)
                                  .post('/api/users')
                                  .send(user);
      assert.equal(responsePost.status, 201, 'Response status code should be 201');
    } catch (err) {
      throw err;
    }
  });
}

describe('Users', function() {
  beforeEach(async function() {
    // runs before all tests in this block
    await UserModel.remove({});
  });

  describe('Empty Database', function() {
    it('Users db should be empty', async function() {
      try {
        const response = await chai.request(app).get('/api/users');
        assert.equal(response.body.length == 0, true, 'Results should be empty');
      } catch (err) {
        throw err;
      }
    });
  })

  describe('Create Users', function(){
    it('Create and return a correct new user', async function() {
      try {
        const newUser = {
          name: 'Tan Nguyen',
          grade: 10,
        }
  
        const response = await chai
                                .request(app)
                                .post('/api/users')
                                .send(newUser);
  
        assert.equal(response.status, 201, 'Status code should be 201');
        assert.ownInclude(response.body, newUser, 'Response body should contain new user');
      } catch (err) {
        throw err;
      }
    });

    it('Create and not return a wrong user', async function() {
      try {
        const newUser = {
          name: 'Tan Nguyen',
          grade: 10,
        }
  
        const wrongUser = {
          name: 'Thi Nguyen',
          grade: 10,
        }
  
        const response = await chai
                                .request(app)
                                .post('/api/users')
                                .send(newUser);
  
        assert.equal(response.status, 201, 'Status code should be 201');
        assert.notEqual(response.body.name, wrongUser.name, 'Response body name should not be equal to the wrong user name');
        assert.notEqual(response.body.grade, wrongUser.grade, 'Response body grade should not be equal to the wrong user grade');

      } catch (err) {
        throw err;
      }
    });
  })

  describe('Get Users', function(){
    it('Check response length', async function() {
      try {
        const responseGet = await chai
                                .request(app)
                                .get('/api/users');
          assert.equal(responseGet.body.length == 0, true, 'Results should be empty');
          assert.equal(responseGet.status, 200, 'Response status code should be 200');
  
        await addUserFromArray(testUserArrays.testUsers);
        
        const response = await chai
                                  .request(app)
                                  .get('/api/users');

        assert.equal(response.body.length, 4, 'Response length should be 4');
        assert.equal(response.status, 200, 'Response status code should be 200');
      } catch (err) {
        throw err;
      }
    });

    it('Check response include all users', async function() {
      try {
        const responseGet = await chai
                                .request(app)
                                .get('/api/users');
          assert.equal(responseGet.body.length == 0, true, 'Results should be empty');
          assert.equal(responseGet.status, 200, 'Response status code should be 200');
  
        await addUserFromArray(testUserArrays.testUsers);
        
        const response = await chai
                                  .request(app)
                                  .get('/api/users');
        
        testUserArrays.testUsers.forEach(async user => {
          try {
            assert.deepOwnInclude(response.body, user, 'Response should include all users');
          } catch (err) {
            throw err;
          }
        });
      } catch (err) {
        throw err;
      }
    });
  })

  describe('Update User', function(){
    it('Check user should be updated', async function() {
      try {
        await addUserFromArray(testUserArrays.testUsers);
        const newUser =
        {
          _id: "5e4b801201ca96379c46b859",
          name: 'Thi Nguyen',
          grade: 90,
        };
        
        const response = await chai
                                .request(app)
                                .put('/api/users/5e4b801201ca96379c46b859')
                                .send(newUser);

        assert.equal(response.status, 200, 'Response status code should be 200');

        const responseGet = await chai
                                .request(app)
                                .get('/api/users/5e4b801201ca96379c46b859');

        assert.equal(response.status, 200, 'Response status code should be 200');
        assert.ownInclude(responseGet.body, newUser, 'User should be updated');
      } catch (err) {
        throw err;
      }
    });
  })

  describe('Delete User', function(){
    it('Check user should be delete', async function() {
      try {
        const testUser = 
        {
            _id: "5e4b801201ca96379c46b859",
            name: 'Tan Nguyen',
            grade: 80,
        };
        
        await addUserFromArray(testUserArrays.testUsers);
        
        const response = await chai
                                .request(app)
                                .delete('/api/users/5e4b801201ca96379c46b859');

        assert.equal(response.status, 200, 'Response status code should be 200');

        const responseGet = await chai
                                .request(app)
                                .get('/api/users/');

        assert.equal(responseGet.body.length, 3, 'Response length should be 3');
        assert.notOwnInclude(responseGet.body, testUser, 'User should be deleted');

      } catch (err) {
        throw err;
      }
    });
  })

  describe('Sort Users Name Ascending', function(){
    it('Check returned users list to have ascending name', async function() {
      try {
        await addUserFromArray(testUserArrays.testUsers);
        
        const response = await chai
                                  .request(app)
                                  .get('/api/users?sort=name&dir=1');

        assert.equal(response.body.length, 4, 'Response length should be 4');
        assert.equal(response.status, 200, 'Response status code should be 200');

        for (i = 0; i < response.body.length; i++) {
          assert.ownInclude(response.body[i], testUserArrays.testUsersNameAsc[i], 'Users should be sorted ascending by name')
        }
  
      } catch (err) {
        throw err;
      }
    });

    it('Check returned users list to not have descending name', async function() {
      try {
        await addUserFromArray(testUserArrays.testUsers);
        
        const response = await chai
                                  .request(app)
                                  .get('/api/users?sort=name&dir=1');

        assert.equal(response.body.length, 4, 'Response length should be 4');
        assert.equal(response.status, 200, 'Response status code should be 200');

        for (i = 0; i < response.body.length; i++) {
          assert.notOwnInclude(response.body[i], testUserArrays.testUsersNameDesc[i], 'Users should be sorted ascending by name')
        }
  
      } catch (err) {
        throw err;
      }
    });
  })

  describe('Sort Users Name Descending', function(){
    it('Check returned users list to have descending name', async function() {
      try {
        await addUserFromArray(testUserArrays.testUsers);
        
        const response = await chai
                                  .request(app)
                                  .get('/api/users?sort=name&dir=-1');

        assert.equal(response.body.length, 4, 'Response length should be 4');
        assert.equal(response.status, 200, 'Response status code should be 200');

        for (i = 0; i < response.body.length; i++) {
          assert.ownInclude(response.body[i], testUserArrays.testUsersNameDesc[i], 'Users should be sorted descending by name')
        }
  
      } catch (err) {
        throw err;
      }
    });

    it('Check returned users list to not have ascending name', async function() {
      try {
        await addUserFromArray(testUserArrays.testUsers);
        
        const response = await chai
                                  .request(app)
                                  .get('/api/users?sort=name&dir=-1');

        assert.equal(response.body.length, 4, 'Response length should be 4');
        assert.equal(response.status, 200, 'Response status code should be 200');

        for (i = 0; i < response.body.length; i++) {
          assert.notOwnInclude(response.body[i], testUserArrays.testUsersNameAsc[i], 'Users should be sorted descending by name')
        }
  
      } catch (err) {
        throw err;
      }
    });
  })

  describe('Sort Users Grade Descending', function(){
    it('Check returned users list to have descending grade', async function() {
      try {
        await addUserFromArray(testUserArrays.testUsers);
        
        const response = await chai
                                  .request(app)
                                  .get('/api/users?sort=grade&dir=-1');

        assert.equal(response.body.length, 4, 'Response length should be 4');
        assert.equal(response.status, 200, 'Response status code should be 200');

        for (i = 0; i < response.body.length; i++) {
          assert.ownInclude(response.body[i], testUserArrays.testUsersGradeDesc[i], 'Users should be sorted descending by grade')
        }
  
      } catch (err) {
        throw err;
      }
    });

    it('Check returned users list to not have ascending grade', async function() {
      try {
        const responseGet = await chai
                                .request(app)
                                .get('/api/users');
          assert.equal(responseGet.body.length == 0, true, 'Results should be empty');
          assert.equal(responseGet.status, 200, 'Response status code should be 200');
  
        await addUserFromArray(testUserArrays.testUsers);
        
        const response = await chai
                                  .request(app)
                                  .get('/api/users?sort=grade&dir=-1');

        assert.equal(response.body.length, 4, 'Response length should be 4');
        assert.equal(response.status, 200, 'Response status code should be 200');

        for (i = 0; i < response.body.length; i++) {
          assert.notOwnInclude(response.body[i], testUserArrays.testUsersGradeAsc[i], 'Users should be sorted descending by grade')
        }
  
      } catch (err) {
        throw err;
      }
    });
  })
});