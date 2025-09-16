import { BuyerRepository } from '@/lib/db/repositories';
import type { CreateBuyer, UpdateBuyer, BuyerFilters, Buyer } from '@/lib/validation';
import { differenceTracker } from '@/lib/utils/diff';
import { NotFoundError } from '@/lib/errors';

export class BuyerService {
  constructor(private buyerRepo = new BuyerRepository()) {}

  async createBuyer(data: CreateBuyer, ownerId: string): Promise<any> {
    const buyer = await this.buyerRepo.create({
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      city: data.city,
      propertyType: data.propertyType,
      bhk: data.bhk,
      purpose: data.purpose,
      budgetMin: data.budgetMin,
      budgetMax: data.budgetMax,
      timeline: data.timeline,
      source: data.source,
      status: data.status || 'New',
      notes: data.notes,
      tags: data.tags || [],
      owner: { connect: { id: ownerId } },
    });

    await this.buyerRepo.createHistory(buyer.id, ownerId, {
      action: 'created',
      changes: { status: { from: null, to: buyer.status } },
    });

    return buyer;
  }

  async getBuyer(id: string, ownerId: string): Promise<any> {
    return this.buyerRepo.findById(id, ownerId);
  }

  async getAllBuyers(filters: BuyerFilters, ownerId?: string) {
    const filtersWithOwner = ownerId ? { ...filters, ownerId } : filters;
    return this.buyerRepo.findMany(filtersWithOwner);
  }

  async updateBuyer(
    id: string, 
    data: Partial<UpdateBuyer>, 
    ownerId: string
  ): Promise<any> {
    const existingBuyer = await this.buyerRepo.findById(id, ownerId);
    if (!existingBuyer) {
      throw new NotFoundError('Buyer');
    }

    const changes = differenceTracker.getDifferences(existingBuyer, data);
    
    const updatedBuyer = await this.buyerRepo.update(id, data, ownerId);

    if (Object.keys(changes).length > 0) {
      await this.buyerRepo.createHistory(id, ownerId, {
        action: 'updated',
        changes,
      });
    }

    return updatedBuyer;
  }

  async deleteBuyer(id: string, ownerId: string): Promise<void> {
    const buyer = await this.buyerRepo.findById(id, ownerId);
    if (!buyer) {
      throw new NotFoundError('Buyer');
    }

    await this.buyerRepo.createHistory(id, ownerId, {
      action: 'deleted',
      changes: { status: { from: buyer.status, to: null } },
    });

    await this.buyerRepo.delete(id, ownerId);
  }

  async getBuyerStats(ownerId?: string) {
    return this.buyerRepo.getStats(ownerId);
  }

  async getBuyerHistory(buyerId: string, ownerId: string) {
    return this.buyerRepo.getHistory(buyerId, ownerId);
  }

  async bulkCreateBuyers(buyers: CreateBuyer[], ownerId: string) {
    const buyersWithOwner = buyers.map(buyer => ({
      ...buyer,
      ownerId,
      tags: buyer.tags || [],
    }));

    const result = await this.buyerRepo.bulkCreate(buyersWithOwner);
    
    return result;
  }
}
