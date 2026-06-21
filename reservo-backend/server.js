require('dotenv').config()
const app = require('./app')
const { connectDB } = require('./config/database')
const startCancelExpiredJob = require('./jobs/cancelExpired.job')

const PORT = process.env.PORT || 3000

async function main() {
  await connectDB()
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
  })
}

main()