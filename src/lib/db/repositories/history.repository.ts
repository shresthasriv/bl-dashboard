import { db } from '../connection';
import { ActionType } from '@prisma/client';

export interface CreateHistoryData {
  buyerId: string;
  userId: string;
  action: ActionType;
  changes: Record<string, any>;
  previousData: Record<string, any>;
  newData: Record<string, any>;
}

export class HistoryRepository {
  async create(data: CreateHistoryData) {
    return db.buyerHistory.create({
      data: {
        buyerId: data.buyerId,
        userId: data.userId,
        action: data.action,
        changes: data.changes,
        previousData: data.previousData,
        newData: data.newData,
      },
    });
  }

  async findByBuyerId(buyerId: string, ownerId: string) {
    // First verify the buyer belongs to the user
    const buyer = await db.buyer.findFirst({
      where: {
        id: buyerId,
        ownerId: ownerId,
      },
    });

    if (!buyer) {
      return [];
    }

    return db.buyerHistory.findMany({
      where: {
        buyerId: buyerId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findById(id: string) {
    return db.buyerHistory.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        buyer: {
          select: {
            id: true,
            fullName: true,
          },
        },
      },
    });
  }

  async deleteByBuyerId(buyerId: string) {
    return db.buyerHistory.deleteMany({
      where: {
        buyerId: buyerId,
      },
    });
  }
}
