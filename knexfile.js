module.exports = {
    development: {
        client: 'sqlite3',
        useNullAsDefault: true,
        connection: {
            filename: './db/queez.db'
        }
    },

    production: {
        client: 'sqlite3',
        useNullAsDefault: true,
        connection: {
            filename: './db/queez.db'
        }
    }
};
