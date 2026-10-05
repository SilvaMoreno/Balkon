import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class StockPurchasesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.stockPurchase.findMany({
      include: { user: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  async create(data: {
    userId: string;
    description: string;
    amount: number;
    date?: string;
    notes?: string;
  }) {
    return this.prisma.stockPurchase.create({
      data: {
        userId: data.userId,
        description: data.description,
        amount: data.amount,
        date: data.date ? new Date(data.date) : new Date(),
        notes: data.notes,
      },
      include: { user: { select: { id: true, name: true } } },
    });
  }
}
