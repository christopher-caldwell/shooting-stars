import { Express } from 'express'
import adze from 'adze'

import { knex, TelescopeData } from '../db'

const getLogger = adze().label('Get')
const postLogger = adze().label('Post')

export const starRoutes = (app: Express): void => {
  app.get('/stars', async (_, res) => {
    try {
      const stars = await knex('star')
      res.send(stars)
    } catch (e) {
      getLogger.error('Error fetching stars', e)
      res.sendStatus(400)
    }
  })

  app.post<Record<string, string>, any, any, TelescopeData[]>(
    '/stars',
    async (req, res) => {
      postLogger.info('Incoming request', req.body)
      const payload = validateRequestBody(req.body)
      try {
        const stars = await knex('star').insert(payload)
        res.send(stars)
      } catch (e) {
        postLogger.error('Error saving star', e)
        res.sendStatus(400)
      }
    },
  )
}

const validateRequestBody = (body: TelescopeData[]): TelescopeData => {
  const target = body[0]
  if (!target) throw new Error('[validateRequestBody]: Index 0 is falsy')
  const { location, world, maxTime, minTime } = target
  if (location === undefined || typeof location !== 'number')
    throw new Error('[validateRequestBody]: Location is malformed')
  if (!minTime || typeof minTime !== 'number')
    throw new Error('[validateRequestBody]: Min Time is malformed')
  if (!maxTime || typeof maxTime !== 'number')
    throw new Error('[validateRequestBody]: Max Time is malformed')
  if (!world || typeof world !== 'number')
    throw new Error('[validateRequestBody]: World is malformed')
  return {
    location,
    world,
    maxTime,
    minTime,
  }
}

// https://z9smj03u77.execute-api.us-east-1.amazonaws.com/stars
