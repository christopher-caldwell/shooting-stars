import { Express } from 'express'

import { starRoutes } from './stars'

export const registerRoutes = (app: Express) => {
  starRoutes(app)
}
