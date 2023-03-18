import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

import { registerRoutes } from './routes'
import { setupDb } from './db'
// import { cleanupOldTimestamps } from './util'

const app = express()
app.use(cors())
app.use(bodyParser.json())

registerRoutes(app)

const main = async () => {
  await setupDb()
  // cleanupOldTimestamps()
  app.listen(5001, () => {
    console.log(`🚀 Skynet is active`)
  })
}

main()
