import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'

import { SearchGymsUseCase } from './search-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: SearchGymsUseCase

describe('Use Case: Search Gyms', async () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()

    sut = new SearchGymsUseCase(gymsRepository)
  })

  it('should be possible to search gyms', async () => {
    await gymsRepository.create({
      title: 'Basic Node Gym',
      latitude: 0,
      longitude: 0,
    })

    await gymsRepository.create({
      title: 'Advanced Node Gym',
      latitude: 0,
      longitude: 0,
    })

    await gymsRepository.create({
      title: 'React Gym',
      latitude: 0,
      longitude: 0,
    })

    const { gyms } = await sut.execute({
      query: 'Node Gym',
      page: 1,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Basic Node Gym' }),
      expect.objectContaining({ title: 'Advanced Node Gym' }),
    ])
  })

  it('should be possible to fetch paginated gyms search', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `React Gym ${i}`,
        latitude: 0,
        longitude: 0,
      })
    }

    const { gyms } = await sut.execute({ query: 'react gym', page: 2 })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'React Gym 21' }),
      expect.objectContaining({ title: 'React Gym 22' }),
    ])
  })
})
