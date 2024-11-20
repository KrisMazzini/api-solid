import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('e2e: Search Gyms', async () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be possible to search gyms by title', async () => {
    const { token } = await createAndAuthenticateUser(app, true)

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Node Gym',
        description: 'Some description.',
        phone: '32 99999-9999',
        latitude: 50,
        longitude: 40,
      })

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'React Gym',
        description: 'Some description.',
        phone: '32 99999-9999',
        latitude: 50,
        longitude: 40,
      })

    const response = await request(app.server)
      .get(`/gyms/search`)
      .query({
        q: 'react',
        page: 1,
      })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: 'React Gym',
      }),
    ])
  })
})
