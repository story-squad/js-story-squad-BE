const tableName = 'receipts'

exports.up = async function(knex) {
  await knex.schema.createTable(tableName, (tbl)=>{
    tbl.increments('ID');
    tbl.string('StripeObjectID', 255)
      .notNullable();
    tbl.string('StripeCustomerId', 255)
      .notNullable();
    tbl.integer('TotalPaid')
      .unsigned()
      .notNullable();
    // DatePurchased will be the timestamp from the stripe receipt
    tbl.string('DatePurchased', 255)
      .notNullable();
    tbl.integer('ParentID')
      .unsigned()
      .references('Parents.ID')
      .onUpdate('CASCADE')
      .onDelete('RESTRICT');
    tbl.integer('SubscriptionTypeID')
      .unsigned()
      .references('subscription_types.ID')
      .onUpdate('CASCADE')
      .onDelete('RESTRICT');
    tbl.string('GiftCode', 255);
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
