import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/db';

export class UserRepository {
  async create(data: Prisma.UserCreateInput) {
    return prisma.user.create({
      data,
    });
  }

  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async update(id: string, data: Prisma.UserUpdateInput) {
    return prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async delete(id: string) {
    return prisma.user.delete({
      where: { id },
    });
  }

  async getUserStats(userId: string) {
    const [buyerCount, recentBuyers] = await Promise.all([
      prisma.buyer.count({
        where: { ownerId: userId },
      }),
      prisma.buyer.findMany({
        where: { ownerId: userId },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          fullName: true,
          status: true,
          createdAt: true,
        },
      }),
    ]);

    return {
      buyerCount,
      recentBuyers,
    };
  }
}
