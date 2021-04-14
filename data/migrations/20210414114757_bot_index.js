
exports.up = function(knex) {
  return knex.schema
    .createTable('BotIndex', (t) => {
        t.increments('ID');
        t.integer('SubmissionID')
            .notNullable()
            .unsigned()
            .references('Submissions.ID')
            .onUpdate('CASCADE')
            .onDelete('RESTRICT');
        t.integer('ChildrenID')
            .notNullable()
            .unsigned()
            .references('Children.ID')
            .onUpdate('CASCADE')
            .onDelete('RESTRICT');
        t.integer('ParentID')
            .notNullable()
            .unsigned()
            .references('Parents.ID')
            .onUpdate('CASCADE')
            .onDelete('RESTRICT');
        t.integer('WritingID')
            .notNullable()
            .unsigned()
            .references('Writing.ID')
            .onUpdate('CASCADE')
            .onDelete('RESTRICT');
        t.integer('DrawingID')
            .notNullable()
            .unsigned()
            .references('Drawing.ID')
            .onUpdate('CASCADE')
            .onDelete('RESTRICT');
        t.integer('CohortID')
            .notNullable()
            .unsigned()
            .references('Cohorts.ID')
            .onUpdate('CASCADE')
            .onDelete('RESTRICT');
        t.integer('StoryID')
            .notNullable()
            .unsigned()
            .references('Stories.ID')
            .onUpdate('CASCADE')
            .onDelete('RESTRICT');
    });
};

exports.down = function(knex) {
    return knex.schema
        .dropTableIfExists('BotIndex');  
};
