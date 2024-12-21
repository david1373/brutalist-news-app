export const up = async function(knex) {
  console.log('Starting articles table creation...');
  try {
    await knex.schema.createTable('articles', table => {
      console.log('Defining table schema...');
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
    console.log('Table creation completed successfully!');
    return Promise.resolve();
  } catch (error) {
    console.error('Error creating articles table:', error);
    return Promise.reject(error);
  }
};

export const down = async function(knex) {
  console.log('Rolling back articles table...');
  try {
    await knex.schema.dropTableIfExists('articles');
    console.log('Rollback completed successfully!');
    return Promise.resolve();
  } catch (error) {
    console.error('Error during rollback:', error);
    return Promise.reject(error);
  }
};