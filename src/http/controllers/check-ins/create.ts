import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { MaxDistanceError } from '@/use-cases/errors/max-distance-error'
import { MaxNumberOfCheckInsError } from '@/use-cases/errors/max-number-of-check-ins-error'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { makeCheckInUseCase } from '@/use-cases/factories/make-check-in-use-case'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  try {
    const createCheckInParamsSchema = z.object({
      gymId: z.string().uuid(),
    })

    const createCheckInBodySchema = z.object({
      userLatitude: z.number().min(-90).max(90),
      userLongitude: z.number().min(-180).max(180),
    })

    const { gymId } = createCheckInParamsSchema.parse(request.params)

    const { userLatitude, userLongitude } = createCheckInBodySchema.parse(
      request.body,
    )

    const userId = request.user.sub

    const checkInUseCase = makeCheckInUseCase()

    await checkInUseCase.execute({
      gymId,
      userId,
      userLatitude,
      userLongitude,
    })

    return reply.status(201).send()
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({
        message: error.message,
      })
    }

    if (
      error instanceof MaxDistanceError ||
      error instanceof MaxNumberOfCheckInsError
    ) {
      return reply.status(400).send({
        message: error.message,
      })
    }

    throw error
  }
}
