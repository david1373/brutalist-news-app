export function up(knex) {
  return knex.schema.createTable('articles', table => {
    table.increments('id');
    table.string('title').notNullable();
    table.text('content');
    table.string('author');
    table.string('source_name');
    table.string('source_url');
    table.string('featured_image');
    table.timestamp('published_date');
    table.timestamps(true, true);
  });
}

export function down(knex) {
  return knex.schema.dropTable('articles');
}