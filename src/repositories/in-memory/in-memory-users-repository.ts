import { Prisma, User } from '@prisma/client'

import { UsersRepository } from '../users-repository'

export class InMemoryUsersRepository implements UsersRepository {
  public users: User[] = []

  async findById(id: string) {
    const user = this.users.find((user) => user.id === id)

    return user || null
  }

  async findByEmail(email: string) {
    const user = this.users.find((user) => user.email === email)

    return user || null
  }

  async create(data: Prisma.UserCreateInput) {
    const user: User = {
      id: `user-${this.users.length + 1}`,
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      created_at: new Date(),
    }

    this.users.push(user)

    return user
  }
}
