import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('e2e: Create Gym', async () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be possible to create a gym', async () => {
    const { token } = await createAndAuthenticateUser(app, true)

    const response = await request(app.server)
      .post(`/gyms`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Node Gym',
        description: 'Some description.',
        phone: '32 99999-9999',
        latitude: 50,
        longitude: 40,
      })

    expect(response.statusCode).toEqual(201)
  })
})
