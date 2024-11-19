import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeFetchNearbyGymsUseCase } from '@/use-cases/factories/make-fetch-nearby-gyms-use-case'

export async function nearby(request: FastifyRequest, reply: FastifyReply) {
  const fetchNearbyGymsQuerySchema = z.object({
    userLatitude: z.number().min(-90).max(90),
    userLongitude: z.number().min(-180).max(180),
    page: z.coerce.number().min(1).default(1),
  })

  const { userLatitude, userLongitude, page } =
    fetchNearbyGymsQuerySchema.parse(request.query)

  const fetchNearbyGymsUseCase = makeFetchNearbyGymsUseCase()

  const { gyms } = await fetchNearbyGymsUseCase.execute({
    userLatitude,
    userLongitude,
    page,
  })

  return reply.status(200).send({
    gyms,
  })
}
