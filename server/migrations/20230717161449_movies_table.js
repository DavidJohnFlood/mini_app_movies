/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('movies', (table) => {
        table.increments();
        table.integer('tmdb_id');
        table.string('title', 128);
        table.string('overview', 512);
        table.string('release_date', 32);
        table.string('poster_path', 64);
        table.string('vote_average', 16);
        table.string('vote_count', 16);
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('movies');
};
