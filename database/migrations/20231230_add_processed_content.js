exports.up = function(knex) {
  return knex.schema.table('articles', table => {
    table.text('processed_content');
    table.timestamp('processed_at');
  });
};

exports.down = function(knex) {
  return knex.schema.table('articles', table => {
    table.dropColumn('processed_content');
    table.dropColumn('processed_at');
  });
};