const factoryGirl = require('factory-girl')
const adapter = new factoryGirl.SequelizeAdapter()
factory = factoryGirl.factory
factory.setAdapter(adapter)

const Company = require('../../models').Company

factory.define('company', Company, {
  id : factory.sequence((n) => n===3 ?  1 : n),
  name: factory.sequence((n) => n===3 ?  'Gambani' : `name${n}`),
})