const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();

const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_DATABASE } = process.env;

const databaseConfig = {
  dev: {
    driver: 'pg',
    user: DB_USER,
    password: DB_PASSWORD,
    host: DB_HOST,
    port: parseInt(DB_PORT),
    database: DB_DATABASE,
  },
};

const jsonData = JSON.stringify(databaseConfig, null, 2);

fs.writeFileSync('database.json', jsonData);

console.log('database.json file created successfully.');
