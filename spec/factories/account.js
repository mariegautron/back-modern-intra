const factoryGirl = require('factory-girl')
const adapter = new factoryGirl.SequelizeAdapter()
factory = factoryGirl.factory
factory.setAdapter(adapter)

const Account = require('../../models').Account

factory.define('account', Account, {
  // firstName: factory.sequence((n) => `firstName${n}`),
})