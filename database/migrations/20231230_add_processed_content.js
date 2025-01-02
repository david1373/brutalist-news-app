export function up(knex) {
  return knex.schema.table('articles', table => {
    table.text('processed_content');
    table.timestamp('processed_at');
  });
}

export function down(knex) {
  return knex.schema.table('articles', table => {
    table.dropColumn('processed_content');
    table.dropColumn('processed_at');
  });
}