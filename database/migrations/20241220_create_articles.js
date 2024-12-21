/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
    return knex.schema.createTable('articles', (table) => {
        table.increments('id').primary();
        table.string('slug').unique().notNullable();
        table.string('title').notNullable();
        table.text('summary');
        table.text('original_content').notNullable();
        table.string('original_author');
        table.string('source_url').notNullable();
        table.string('source_name').notNullable();
        table.text('transformed_content');
        table.timestamp('transformed_at');
        table.boolean('is_transformed').defaultTo(false);
        table.jsonb('images').defaultTo('[]');
        table.string('featured_image_url');
        table.string('featured_image_credit');
        table.jsonb('categories').defaultTo('[]');
        table.jsonb('tags').defaultTo('[]');
        table.timestamp('original_published_at');
        table.timestamp('scraped_at').defaultTo(knex.fn.now());
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
        table.enu('status', ['draft', 'processing', 'published', 'error']).defaultTo('draft');
        table.text('processing_error');
        table.index('slug');
        table.index('source_name');
        table.index('status');
        table.index('original_published_at');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
    return knex.schema.dropTable('articles');
};