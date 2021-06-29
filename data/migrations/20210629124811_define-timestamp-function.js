// add a Postgres function to update timestamps

exports.up = async function(knex) {
  return knex.raw(`
    CREATE OR REPLACE FUNCTION update_timestamp() RETURNS TRIGGER
    LANGUAGE plpgsql
    AS
    $$
    BEGIN
      NEW.UpdatedAt = CURRENT_TIMESTAMP;
      RETURN NEW;
    END;
    $$;
  `);
};

exports.down = function(knex) {
  return knex.raw(`
    DROP FUNCTION IF EXISTS update_timestamp() CASCADE;
  `);
};
