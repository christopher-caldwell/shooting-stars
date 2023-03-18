import adze from 'adze'
import { convertTimeToMs } from '@caldwell619/ms'

import { knex } from './db'

const timeThresholdInMs = convertTimeToMs('15 min')!
const logger = adze().label('Old Star Cleanup')
const removeOldTimestamps = async () => {
  try {
    const idsToBeDeleted: number[] = []
    const allStars = await knex('star')
    allStars.forEach(({ id, maxTime }) => {
      if (maxTime * 1000 >= Date.now() + timeThresholdInMs) {
        idsToBeDeleted.push(id)
      }
    })
    if (!idsToBeDeleted.length) return

    await knex('star').whereIn('id', idsToBeDeleted).del()
    logger.success(`Cleaned up ${idsToBeDeleted.length} star locations`)
  } catch (e) {
    logger.error('Could not complete', e)
  }
}

export const cleanupOldTimestamps = () => {
  setInterval(() => {
    removeOldTimestamps()
  }, timeThresholdInMs)
}
