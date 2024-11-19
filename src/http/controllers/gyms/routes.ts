import { FastifyInstance } from 'fastify'

import { verifyJwt } from '@/http/middlewares/verify-jwt'

import { create } from './create'
import { nearby } from './nearby'
import { search } from './search'

export async function gymRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)

  app.post('/', create)
  app.get('/search', search)
  app.get('/nearby', nearby)
}
