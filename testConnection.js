import { Sequelize } from 'sequelize';
// import { development as config } from './config/config.json';

const config = {
  username: 'postgres',
  password: 'Postgres89663254Pass!',
  database: 'FarmDB',
  host: '0.0.0.0',
  port: '8760',
  dialect: 'postgres',
};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
  },
);

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  } finally {
    await sequelize.close();
  }
}

testConnection();
