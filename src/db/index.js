const {Sequelize} = require('sequelize');
require('dotenv').config();

const seq = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER_NAME,
    process.env.DB_PASSWD,
    {
        host: process.env.DB_HOST_NAME,
        port: process.env.DB_PORT_NO,
        dialect: 'postgres',
        dialectOptions: {
            ssl: {
              require: true,
              rejectUnauthorized: false
            }
        },
        logging: false, //Disabling sql logs
    }
);

module.exports = seq;