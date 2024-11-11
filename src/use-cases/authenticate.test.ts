import { hash } from 'bcryptjs'
import { describe, expect, it } from 'vitest'

import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'

import { AuthenticateUseCase } from './authenticate'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

describe('Use Case: Authenticate', async () => {
  it('should be possible to authenticate', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const authenticateUseCase = new AuthenticateUseCase(usersRepository)

    const password = '123456'

    await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash(password, 6),
    })

    const { user } = await authenticateUseCase.execute({
      email: 'johndoe@example.com',
      password,
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be possible to authenticate with wrong email', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const sut = new AuthenticateUseCase(usersRepository)

    expect(() =>
      sut.execute({
        email: 'johndoe@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be possible to authenticate with wrong password', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const sut = new AuthenticateUseCase(usersRepository)

    const password = '123456'
    const wrongPassword = '654321'

    await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash(password, 6),
    })

    expect(() =>
      sut.execute({
        email: 'johndoe@example.com',
        password: wrongPassword,
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
