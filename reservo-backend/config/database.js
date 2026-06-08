const { Sequelize } = require('sequelize')

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    timezone: '-04:00', // America/La_Paz
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
)

async function connectDB() {
  try {
    await sequelize.authenticate()
    console.log('PostgreSQL conectado')
  } catch (error) {
    console.error('Error conectando a la BD:', error)
    process.exit(1)
  }
}

module.exports = { sequelize, connectDB }