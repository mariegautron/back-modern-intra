const request = require('supertest')
const app = require('../app')
const db = require('../models');
const cleanDb = require('./helpers/cleanDb')
require('./factories/company').factory
require('./factories/user').factory
require('./factories/account').factory
const factory = require('factory-girl').factory



const payload = {
  attendees: [{
  displayName: 'Nick Stock',
  email: 'client@client.com',
  organizer: true,
  response_status: 'accepted'
},
{
  displayName: 'Nicholas Stock',
  email: 'not_client@client.com',
  response_status: 'accepted',
  self: true
}
],
  end: { date_time: Date.parse('2018-03-05T18:30:00.000+01:00') },
  html_link: 'https://www.google.com/calendar/event?eid=MGptdjJ1ZDljMWo3Y2kyZzFqZ21ybWY2c3Mgbmlja0BnZW1iYW5pLmNvbQ',
  id: '0jmv2ud9c1j7ci2g1jgmrmf6ss',
  start: { date_time: Date.parse('2018-03-05T12:30:00.000+01:00') },
  status: 'confirmed',
}

const convertDate = (date) => {
  return new Date(date)
}

const getId = (link) => {
  return link.split('=')[1]
}
class EventConverter {

  constructor(payload, account) {
    this.startDate = convertDate(payload.start.date_time)
    this.endDate = convertDate(payload.end.date_time)
    this.eid = getId(payload.html_link)
    this.account = account
  }
  // async client(){
  //   // la personne ds l'évènement
  //       // let users = this.account.getClientUsers()
  //       user = await factory.createMany('user', 2)
    
  //   return users.filter( user => user.email)

  // }
}

describe('test start fonction', () => {

  let eventConverter;
  
  beforeEach(async () => {
    eventConverter = new EventConverter(payload)
  })

    test('it should return type Date for start date', async () => {
      expect(eventConverter.startDate instanceof Date).toBe(true);
    })

    test('it should return type Date for end date', async () => {
      expect(eventConverter.endDate instanceof Date).toBe(true);
    })


  });

  describe('test getID function', () => {

    let eventConverter;
  
    beforeEach(async () => {
      eventConverter = new EventConverter(payload)
    })

    test('it should return id from html_link', async () => {
      expect(eventConverter.eid).toBe('MGptdjJ1ZDljMWo3Y2kyZzFqZ21ybWY2c3Mgbmlja0BnZW1iYW5pLmNvbQ');
    })

  });

  describe('test findAll', () => {
    let eventConverter;
    let client1, client2, account;

    let dataAccount = {}
    let dataUser= {}
    let dataUser2= {}

  
    beforeEach(async () => {
      await cleanDb(db)
      // client1 = { email: "a@mail.com" }
      // client2 = { email: "b@mail.com" }
      // account = {
      //   getClientUsers: () => {
      //     //user qui sont client 
      //     return [client1, client2]
      //   }
      // }
      // eventConverter = new EventConverter(payload, account)

      company = await factory.create('company')
      account = await factory.build('account')

      dataAccount.name = account.name
      dataAccount.CompanyId = company.id
      dataAccount.id = account.id
      
      await db.Account.create(dataAccount)

      user = await factory.build('user')

      dataUser.name = user.name
      dataUser.email = user.email
      dataUser.CompanyId = company.id
      
      await db.User.create(dataUser)

      user2 = await factory.build('user')
      company2 = await factory.create('company')

      dataUser2.name = user2.name
      dataUser2.email = user2.email
      dataUser2.CompanyId = company2.id
      
      await db.User.create(dataUser2)




      // console.log(user);
    })

    // afterEach(async () => {
    //   await cleanDb(db)
    // })

    test('It should retrieve 4 users in db', async () => {
      const usersInDatabase = await db.User.findAll();

     function getClientsUsers()  {
        clients = []
        usersInDatabase.map((user) => {
          if (user.CompanyId !== 1) {
            clients.push(user)
          }
        })
        return clients;
      };

      function getContributorsUsers()  {
        contributors = []
        usersInDatabase.map((user) => {
          if (user.CompanyId === 1) {
            contributors.push(user)
          }
        })
        return contributors;
      };

      console.log(getClientsUsers())
      console.log(getContributorsUsers())
      // console.log(usersInDatabase)
      expect(usersInDatabase.length).toBe(2)
    });

    test('It should retrieve 1 account in db', async () => {
      const accountInDatabase = await db.Account.findAll()
      // console.log(accountInDatabase, account)
      expect(accountInDatabase.length).toBe(1)
    });
  })





