import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('e2e: Nearby Gyms', async () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be possible to list nearby gyms', async () => {
    const { token } = await createAndAuthenticateUser(app)

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Near Gym',
        description: 'Some description.',
        phone: '32 99999-9999',
        latitude: -21.7817975,
        longitude: -43.3933066,
      })

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Far Gym',
        description: 'Some description.',
        phone: '32 99999-9999',
        latitude: -21.7913871,
        longitude: -43.279421,
      })

    const response = await request(app.server)
      .get(`/gyms/nearby`)
      .query({
        userLatitude: -21.7783455,
        userLongitude: -43.3979385,
        page: 1,
      })
      .set('Authorization', `Bearer ${token}`)
      .send()

    console.log(response)

    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: 'Near Gym',
      }),
    ])
  })
})
