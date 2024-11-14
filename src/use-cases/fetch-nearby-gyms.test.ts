import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'

import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsUseCase

describe('Use Case: Fetch Nearby Gyms', async () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()

    sut = new FetchNearbyGymsUseCase(gymsRepository)
  })

  it('should be possible to fetch nearby gyms', async () => {
    await gymsRepository.create({
      title: 'Near Gym',
      latitude: -21.7817975,
      longitude: -43.3933066,
    })

    await gymsRepository.create({
      title: 'Far Gym',
      latitude: -21.7913871,
      longitude: -43.279421,
    })

    const { gyms } = await sut.execute({
      userLatitude: -21.7783455,
      userLongitude: -43.3979385,
      page: 1,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Near Gym' })])
  })

  it('should be possible to fetch paginated nearby gyms', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `Near Gym ${i}`,
        latitude: -21.7817975,
        longitude: -43.3933066,
      })
    }

    const { gyms } = await sut.execute({
      userLatitude: -21.7783455,
      userLongitude: -43.3979385,
      page: 2,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Near Gym 21' }),
      expect.objectContaining({ title: 'Near Gym 22' }),
    ])
  })
})
