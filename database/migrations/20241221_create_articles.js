// database/migrations/20241221_create_articles.js

export const up = async function(knex) {
  return knex.schema.createTable('articles', table => {
    table.increments('id').primary();
    table.string('title').notNullable();
    table.text('original_content').notNullable();
    table.text('transformed_content');
    table.string('source_url').notNullable();
    table.string('source_name').notNullable();
    table.jsonb('images').defaultTo('[]');
    table.string('featured_image');
    table.string('author');
    table.timestamp('published_date');
    table.string('processing_status').defaultTo('pending');
    table.text('error_log');
    table.timestamps(true, true);
  });
};

export const down = async function(knex) {
  return knex.schema.dropTable('articles');
};
