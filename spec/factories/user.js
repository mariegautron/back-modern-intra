const factoryGirl = require('factory-girl')
const adapter = new factoryGirl.SequelizeAdapter()
factory = factoryGirl.factory
factory.setAdapter(adapter)

const User = require('../../models').User

factory.define('user', User, {
    name: factory.sequence((n) => `name${n}`),
    email: factory.sequence((n) => `email${n}`),
})