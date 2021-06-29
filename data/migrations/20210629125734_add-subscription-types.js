const tableName = 'subscription_types'

exports.up = async function(knex) {
  await knex.schema.createTable(tableName, (tbl) => {
    tbl.increments('ID');
    tbl.string('Name', 255).notNullable();
    // Price in cents USD
    tbl.integer('Price').unsigned().notNullable();
    // format: 1.00 months
    // 1 week: 0.25
    tbl.decimal('Months',4,2).notNullable();
    tbl.string('Visibility', 255).defaultTo('Visible').notNullable();
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
