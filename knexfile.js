export default {
  client: 'sqlite3',
  connection: {
    filename: './database/db.sqlite'
  },
  useNullAsDefault: true,
  migrations: {
    directory: './database/migrations'
  }
};