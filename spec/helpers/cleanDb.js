const cleanDb = async (db) => {
    await db.Author.destroy({ truncate: { cascade: true } });
    await db.Post.destroy({ truncate: { cascade: true } });
    await db.Event.destroy({ truncate: { cascade: true } });
  }
  module.exports = cleanDb