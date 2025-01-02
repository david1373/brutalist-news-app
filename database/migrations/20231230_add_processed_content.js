export function up(knex) {
  return knex.schema.table('articles', table => {
    table.text('processed_content').nullable();
    table.timestamp('processed_at').nullable();
  });
}

export function down(knex) {
  return Promise.all([
    knex.schema.table('articles', table => {
      table.dropColumn('processed_content');
      table.dropColumn('processed_at');
    })
  ]);
}