import { randomUUID } from 'node:crypto'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'

import { CheckInUseCase } from './check-in'
import { MaxDistanceError } from './errors/max-distance-error'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

let userId: string
let gymId: string

let userLatitude: number
let userLongitude: number

describe('Use Case: Get User Profile', async () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()

    sut = new CheckInUseCase(checkInsRepository, gymsRepository)

    userId = randomUUID()
    gymId = randomUUID()

    userLatitude = -21.7601687
    userLongitude = -43.3484179

    await gymsRepository.create({
      id: gymId,
      title: 'JavaScript Gym',
      description: null,
      latitude: userLatitude,
      longitude: userLongitude,
      phone: null,
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be possible to check in', async () => {
    const { checkIn } = await sut.execute({
      userId,
      gymId,
      userLatitude,
      userLongitude,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be possible to check in twice on the same day', async () => {
    vi.setSystemTime(new Date(2024, 0, 1, 8, 0, 0))

    await sut.execute({
      userId,
      gymId,
      userLatitude,
      userLongitude,
    })

    await expect(() =>
      sut.execute({
        userId,
        gymId,
        userLatitude,
        userLongitude,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('should be possible to check in twice but on different days', async () => {
    vi.setSystemTime(new Date(2024, 0, 1, 8, 0, 0))

    await sut.execute({
      userId,
      gymId,
      userLatitude,
      userLongitude,
    })

    vi.setSystemTime(new Date(2024, 0, 2, 8, 0, 0))

    const { checkIn } = await sut.execute({
      userId,
      gymId,
      userLatitude,
      userLongitude,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be possible to check in on distant gym', async () => {
    await gymsRepository.create({
      id: 'distant-gym',
      title: 'JavaScript Gym',
      description: null,
      latitude: -21.7730056,
      longitude: -43.3465522,
      phone: null,
    })

    await expect(() =>
      sut.execute({
        userId,
        gymId: 'distant-gym',
        userLatitude,
        userLongitude,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })

  it('should be possible to check in on near gym', async () => {
    const { checkIn } = await sut.execute({
      userId,
      gymId,
      userLatitude,
      userLongitude,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })
})
