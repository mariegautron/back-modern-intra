const request = require('supertest')
const app = require('../app')
const cleanDb = require('./helpers/cleanDb')
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
  client(){
    // la personne ds l'évènement
    let users = this.account.getClientUsers()
    return users.filter( user => user.email)
  }
}

describe('test start fonction', () => {

    let eventConverter;
    let client1, client2, account;
  
    beforeEach(async () => {
      client1 = { email: "a@mail.com" }
      client2 = { email: "b@mail.com" }
      account = {
        getClientUsers: () => {
          //user qui sont client 
          return [client1, client2]
        }
      }
      eventConverter = new EventConverter(payload, account)
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


