const tableName = 'subscriptions';

exports.up = async function(knex) {
  await knex.schema.createTable(tableName, (tbl) => {
    tbl.increments('ID');
    tbl.integer('ParentID')
      .unsigned()
      .references('Parents.ID')
      .notNullable()
      .onUpdate('CASCADE')
      .onDelete('RESTRICT');
    tbl.integer('ReceiptID')
      .unsigned()
      .references('receipts.ID')
      .notNullable()
      .onUpdate('CASCADE')
      .onDelete('RESTRICT');
    tbl.string('GiftCode', 255);
    tbl.string('DateActivated', 255)
      .notNullable();
    tbl.string('DateExpires', 255);
    tbl.timestamps(false, true);
  });

  await knex.raw(`
    CREATE TRIGGER update_timestamp
    BEFORE UPDATE
    ON ${tableName}
    FOR EACH ROW
    EXECUTE PROCEDURE update_timestamp();
  `);
};

exports.down = function(knex) {
  return knex.schema.dropTable(tableName);
};
