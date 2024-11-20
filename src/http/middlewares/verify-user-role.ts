import { FastifyReply, FastifyRequest } from 'fastify'

export function verifyUserRole(roleToVerify: 'ADMIN' | 'MEMBER') {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify()

      const role = request.user.role

      if (role !== roleToVerify) {
        return reply.status(401).send({ message: 'Unauthorized.' })
      }
    } catch {
      return reply.status(401).send({ message: 'Unauthorized.' })
    }
  }
}
