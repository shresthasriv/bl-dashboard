import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/db';
import type { BuyerFilters, PaginatedResponse } from '@/types';

export class BuyerRepository {
  async create(data: Prisma.BuyerCreateInput) {
    return prisma.buyer.create({
      data,
      include: {
        owner: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  async findById(id: string, ownerId?: string) {
    const buyer = await prisma.buyer.findUnique({
      where: { id },
      include: {
        owner: {
          select: { id: true, name: true, email: true },
        },
        history: {
          orderBy: { changedAt: 'desc' },
          take: 5,
          include: {
            changedByUser: {
              select: { id: true, name: true, email: true },
            },
          },
        },
      },
    });

    if (buyer && ownerId && buyer.ownerId !== ownerId) {
      return null;
    }

    return buyer;
  }

  async findMany(filters: any): Promise<PaginatedResponse<any>> {
    const {
      city,
      propertyType,
      status,
      timeline,
      source,
      budgetMin,
      budgetMax,
      search,
      page = 1,
      limit = 10,
      sortBy = 'updatedAt',
      sortOrder = 'desc',
      ownerId
    } = filters;

    const skip = (page - 1) * limit;
    const where: Prisma.BuyerWhereInput = {};

    if (ownerId) where.ownerId = ownerId;
    if (city) where.city = city;
    if (propertyType) where.propertyType = propertyType;
    if (status) where.status = status;
    if (timeline) where.timeline = timeline;
    if (source) where.source = source;

    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } },
        { email: { contains: search, mode: 'insensitive' } },
        { notes: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (budgetMin !== undefined || budgetMax !== undefined) {
      const budgetConditions = [] as Prisma.BuyerWhereInput[];
      if (budgetMin !== undefined) {
        budgetConditions.push({ budgetMin: { gte: budgetMin } });
        budgetConditions.push({ budgetMax: { gte: budgetMin } });
      }
      if (budgetMax !== undefined) {
        budgetConditions.push({ budgetMin: { lte: budgetMax } });
        budgetConditions.push({ budgetMax: { lte: budgetMax } });
      }
      
      if (where.OR) {
        where.AND = [{ OR: where.OR }, { OR: budgetConditions }];
        delete where.OR;
      } else {
        where.OR = budgetConditions;
      }
    }

    const [buyers, total] = await Promise.all([
      prisma.buyer.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          owner: {
            select: { id: true, name: true, email: true },
          },
        },
      }),
      prisma.buyer.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: buyers,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  async update(id: string, data: Prisma.BuyerUpdateInput, ownerId?: string) {
    const where: Prisma.BuyerWhereUniqueInput = { id };
    
    const buyer = await prisma.buyer.update({
      where,
      data: {
        ...data,
        updatedAt: new Date(),
      },
      include: {
        owner: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (ownerId && buyer.ownerId !== ownerId) {
      throw new Error('Unauthorized: Cannot update buyer owned by another user');
    }

    return buyer;
  }

  async delete(id: string, ownerId?: string) {
    const buyer = await this.findById(id, ownerId);
    if (!buyer) {
      throw new Error('Buyer not found');
    }

    return prisma.buyer.delete({
      where: { id },
    });
  }

  async createHistory(buyerId: string, changedBy: string, diff: any) {
    return prisma.buyerHistory.create({
      data: {
        buyerId,
        changedBy,
        diff,
      },
    });
  }

  async getHistory(buyerId: string, ownerId: string) {
    // verify ownership
    const buyer = await prisma.buyer.findFirst({
      where: { id: buyerId, ownerId },
      select: { id: true },
    });
    if (!buyer) return [];

    return prisma.buyerHistory.findMany({
      where: { buyerId },
      orderBy: { changedAt: 'desc' },
      include: {
        changedByUser: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  async bulkCreate(buyers: Prisma.BuyerCreateManyInput[]) {
    return prisma.buyer.createMany({
      data: buyers,
      skipDuplicates: true,
    });
  }

  async getStats(ownerId?: string) {
    const where: Prisma.BuyerWhereInput = ownerId ? { ownerId } : {};

    const [
      total,
      statusCounts,
      cityCounts,
      propertyTypeCounts,
    ] = await Promise.all([
      prisma.buyer.count({ where }),
      prisma.buyer.groupBy({
        by: ['status'],
        where,
        _count: { status: true },
      }),
      prisma.buyer.groupBy({
        by: ['city'],
        where,
        _count: { city: true },
      }),
      prisma.buyer.groupBy({
        by: ['propertyType'],
        where,
        _count: { propertyType: true },
      }),
    ]);

    return {
      total,
      byStatus: statusCounts.reduce((acc, item) => {
        acc[item.status] = item._count.status;
        return acc;
      }, {} as Record<string, number>),
      byCity: cityCounts.reduce((acc, item) => {
        acc[item.city] = item._count.city;
        return acc;
      }, {} as Record<string, number>),
      byPropertyType: propertyTypeCounts.reduce((acc, item) => {
        acc[item.propertyType] = item._count.propertyType;
        return acc;
      }, {} as Record<string, number>),
    };
  }
}
