const request = require('supertest')
const app = require('../app')
const db = require('../models');
const cleanDb = require('./helpers/cleanDb')
require('./factories/company').factory
require('./factories/user').factory
require('./factories/account').factory
const factory = require('factory-girl').factory


describe('/GET', () => {

  beforeEach(async () => {
    await cleanDb(db)
    users = await factory.createMany('user', 5)
    response = await request(app).get('/users').set('Accept', 'application/json')
  })

  test('It should not retrieve users in db', async () => {
    const usersInDatabase = await db.User.findAll()
    expect(response.statusCode).toBe(200)
    expect(usersInDatabase.length).toBe(5)
  });
  test('It should return a json with a void array', async () => {
    expect(response.body.length).toBe(5)
    users.forEach((user, i) => {
      expect(response.body[i].id).toEqual(user.id)
    })
  });


  });

  describe('/POST', () => {


    let response;
    let data = {};
  
    beforeAll(async () => {
      await cleanDb(db)
      company = await factory.create('company')
      data.firstName = 'John'
      data.lastName = 'Wick'
      data.email = 'john@wick.com'
      data.userType = 'userTypeJohn'
      data.company = company.id
      data.admin = false
      data.clientDashboard = false
      data.employeeDashboard = false
      data.hourlyRate = 'coute très cher'
      response = await request(app).post('/user').send(data);
    })

    test('It should respond with a 200 status code', async () => {
        expect(response.statusCode).toBe(200);
      });

    test('It should return a json with the new author', async () => {

        expect(response.body.firstName).toBe(data.firstName);
        expect(response.body.lastName).toBe(data.lastName);
        expect(response.body.email).toBe(data.email);
        expect(response.body.userType).toBe(data.userType);
        expect(response.body.company).toBe(data.company);
        expect(response.body.admin).toBe(data.admin);
        expect(response.body.clientDashboard).toBe(data.clientDashboard);
        expect(response.body.hourlyRate).toBe(data.hourlyRate);
      });

      test('It should create and retrieve a post for the selected author', async () => {
        const user = await db.User.findOne({where: {
          id: response.body.id
        }})
        expect(user.id).toBe(response.body.id)
        expect(user.firstName).toBe(data.firstName)
        expect(user.lastName).toBe(data.lastName)
      });

  });
