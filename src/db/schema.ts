import client from 'knex'

export interface TelescopeData {
  location: number
  world: number
  minTime: number
  maxTime: number
}

export const knex = client({
  client: 'sqlite3',
  connection: {
    filename: './mydb.sqlite',
  },
  useNullAsDefault: true,
})

export const setupDb = async () => {
  const doesStarExist = await knex.schema.hasTable('star')

  if (!doesStarExist) {
    await knex.schema.createTable('star', (table) => {
      table.increments('id')
      table.integer('location')
      table.integer('world')
      table.bigInteger('minTime')
      table.bigInteger('maxTime')
    })
  }
}

declare module 'knex/types/tables' {
  interface BaseRecord {
    id: number
    created_at: string
    updated_at: string
  }
  interface Tables {
    star: TelescopeData & BaseRecord
  }
}
