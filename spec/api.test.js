const { response } = require('express');
const request = require('supertest')
const app = require('../app')
const db = require('../models');
const cleanDb = require('./helpers/cleanDb')
require('./factories/company').factory
require('./factories/user').factory
require('./factories/account').factory
const factory = require('factory-girl').factory

compareUsers = (firstUser, secondUser) => {
  expect(firstUser.firstName).toBe(secondUser.firstName);
  expect(firstUser.lastName).toBe(secondUser.lastName);
  expect(firstUser.email).toBe(secondUser.email);
  expect(firstUser.userType).toBe(secondUser.userType);
  expect(firstUser.company).toBe(secondUser.company);
  expect(firstUser.admin).toBe(secondUser.admin);
  expect(firstUser.clientDashboard).toBe(secondUser.clientDashboard);
  expect(firstUser.hourlyRate).toBe(secondUser.hourlyRate);

}

describe('/GET companies', () => {

  let response;
  let companies;
  let responseFormated;

  beforeEach(async () => {
    await cleanDb(db)
   companies = await factory.createMany('company', 2)
    response = await request(app).get('/api/companies')

    responseFormated = []
   companies.forEach(company => {
      responseFormated.push({attributes : company, type:  'companies'})
    });
  })

  test('It should not retrieve companies in db', async () => {
    const companiesInDatabase = await db.Company.findAll()
    expect(response.statusCode).toBe(200)
    expect (companiesInDatabase.length).toBe(2)
  });
  test('It should return a json with a void array', async () => {
    expect(response.body.data.length).toBe(2)
   companies.forEach((company, i) => {
      let attributes = response.body.data[i].attributes
      expect(attributes.id).toEqual(company.id)
      expect(attributes.name).toEqual(company.name)

    })
    // expect(response.body.data).toEqual(responseFormated) 
  });


  });

describe('/GET users', () => {

  let response;
  let users;
  let responseFormated;

  beforeEach(async () => {
    await cleanDb(db)
    users = await factory.createMany('user', 5)
    response = await request(app).get('/api/users')

    responseFormated = []
    users.forEach(user => {
      responseFormated.push({attributes : user, type: 'users'})
    });
  })

  test('It should not retrieve users in db', async () => {
    const usersInDatabase = await db.User.findAll()
    expect(response.statusCode).toBe(200)
    expect(usersInDatabase.length).toBe(5)
  });
  test('It should return a json with a void array', async () => {
    expect(response.body.data.length).toBe(5)
    users.forEach((user, i) => {
      let attributes = response.body.data[i].attributes
      compareUsers(attributes, user)

    })
    // expect(response.body.data).toEqual(responseFormated) 
  });


  });

  describe('/POST users', () => {


    let response;
    let data = {};
  
    beforeAll(async () => {
      await cleanDb(db)
      company = await factory.create('company')
      data.firstName = 'John'
      data.lastName = 'Wick'
      data.email = 'john@wick.com'
      data.userType = 'userTypeJohn'
      data.company = company.name
      data.admin = false
      data.clientDashboard = false
      data.employeeDashboard = false
      data.hourlyRate = '50'
      response = await request(app).post('/api/users').send({data : {attributes : data, type:  'user'}});
    })

    test('It should respond with a 200 status code', async () => {
        expect(response.statusCode).toBe(200);
      });

    test('It should return a json with the new author', async () => {
      let attributes = response.body.data.attributes
      compareUsers(attributes, data)
      });

      test('It should create and retrieve a post for the selected author', async () => {
        let attributes = response.body.data.attributes
        const user = await db.User.findOne({where: {
          id: attributes.id
        }})
        expect(user.id).toBe(attributes.id)
        compareUsers(attributes, user)
      });

  });
