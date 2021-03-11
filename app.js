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


module.exports = app
