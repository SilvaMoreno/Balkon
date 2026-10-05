import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CashCloseoutService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.cashCloseout.findMany({
      include: { user: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async create(data: {
    userId: string;
    cashAmount: number;
    cardAmount: number;
    notes?: string;
  }) {
    const totalCounted = Number(data.cashAmount) + Number(data.cardAmount);

    return this.prisma.cashCloseout.create({
      data: {
        userId: data.userId,
        cashAmount: data.cashAmount,
        cardAmount: data.cardAmount,
        totalCounted,
        notes: data.notes,
      },
      include: { user: { select: { id: true, name: true } } },
    });
  }
}
