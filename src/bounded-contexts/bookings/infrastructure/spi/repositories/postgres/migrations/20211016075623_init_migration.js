exports.up = function (knex) {
  return knex.schema.createTable('bookings', (table) => {
    table.uuid('id').primary().notNullable();
    table.string('person_name', 30).notNullable();
    table.integer('people_number').notNullable();
    table.date('date').notNullable();
    table.integer('table_number').notNullable();
    table.boolean('opened_status').notNullable().defaultTo(false);
    table.integer('total_billed');
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('bookings');
};
