import { randomUUID } from 'node:crypto'

import { Gym, Prisma } from '@prisma/client'

import { getKilometersBetweenCoordinates } from '@/utils/get-kilometers-between-coordinates'

import { FindManyNearbyParams, GymsRepository } from '../gyms-repository'

export class InMemoryGymsRepository implements GymsRepository {
  public gyms: Gym[] = []

  async create(data: Prisma.GymCreateInput) {
    const gym: Gym = {
      id: data.id ?? randomUUID(),
      title: data.title,
      description: data.description ?? null,
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString()),
      phone: data.phone ?? null,
    }

    this.gyms.push(gym)

    return gym
  }

  async findById(id: string) {
    const gym = this.gyms.find((gym) => gym.id === id)

    return gym || null
  }

  async findManyNearby(params: FindManyNearbyParams) {
    return this.gyms
      .filter((gym) => {
        const distanceInKilometers = getKilometersBetweenCoordinates(
          {
            latitude: params.latitude,
            longitude: params.longitude,
          },
          {
            latitude: gym.latitude.toNumber(),
            longitude: gym.longitude.toNumber(),
          },
        )

        return distanceInKilometers < 10
      })
      .slice((params.page - 1) * 20, params.page * 20)
  }

  async searchMany(query: string, page: number) {
    return this.gyms
      .filter((gym) => gym.title.toLowerCase().includes(query.toLowerCase()))
      .slice((page - 1) * 20, page * 20)
  }
}
