const cleanDb = async (db) => {
    await db.User.destroy({ truncate: { cascade: true } });
    await db.Account.destroy({ truncate: { cascade: true } });
    await db.Company.destroy({ truncate: { cascade: true } });
  }
  module.exports = cleanDb