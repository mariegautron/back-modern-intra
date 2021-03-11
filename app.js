const express = require('express')
const bodyParser = require('body-parser')
const db = require('./models')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(express.static('app/public'))

app.get('/', async (req, res) => {
  res.status(200).send('Hello World!')
})

app.get('/users', async (req, res) => {
  await db.User.findAll().then((result) => {
    return res.json(result)
  })
})

app.post('/user', async (req, res) => {
  await db.User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    userType: req.body.userType,
    company: req.body.company,
    admin: req.body.admin,
    clientDashboard: req.body.clientDashboard,
    employeeDashboard: req.body.employeeDashboard,
    hourlyRate: req.body.hourlyRate  }).then((result) => {return res.json(result)})
})

module.exports = app
