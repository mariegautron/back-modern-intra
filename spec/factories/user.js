const factoryGirl = require('factory-girl')
const adapter = new factoryGirl.SequelizeAdapter()
factory = factoryGirl.factory
factory.setAdapter(adapter)

const User = require('../../models').User

factory.define('user', User, {
    firstName: factory.sequence((n) => `name${n}`),
    lastName: factory.sequence((n) => `name${n}`),
    email: factory.sequence((n) => `email${n}`),
    userType: factory.sequence((n) => `userType${n}`),
    company: factory.sequence((n) => `company${n}`),
    admin: factory.sequence(() => false),
    clientDashboard: factory.sequence(() => false),
    employeeDashboard: factory.sequence(() => false),
    hourlyRate: factory.sequence((n) => `hourlyRate${n}`),
})