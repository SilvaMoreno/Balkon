import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SaleStatus } from '@prisma/client';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters: { clientId?: string; from?: string; to?: string }) {
    const where: any = {};
    if (filters.clientId) where.clientId = filters.clientId;
    if (filters.from || filters.to) {
      where.createdAt = {};
      if (filters.from) where.createdAt.gte = new Date(filters.from);
      if (filters.to) where.createdAt.lte = new Date(filters.to);
    }

    return this.prisma.payment.findMany({
      where,
      include: {
        client: { select: { id: true, name: true } },
        user: { select: { id: true, name: true } },
        sales: { include: { sale: { select: { id: true, total: true } } } },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  async create(data: {
    clientId: string;
    userId: string;
    amount: number;
    saleIds?: string[];
    notes?: string;
  }) {
    const client = await this.prisma.client.findUnique({ where: { id: data.clientId } });
    if (!client) throw new NotFoundException('Cliente não encontrado');

    if (!data.saleIds || data.saleIds.length === 0) {
      const pendingSales = await this.prisma.sale.findMany({
        where: { clientId: data.clientId, status: { in: ['PENDING', 'PARTIAL'] } },
        orderBy: { createdAt: 'asc' },
      });

      if (pendingSales.length === 0) throw new BadRequestException('Cliente não tem dívidas pendentes');

      data.saleIds = pendingSales.map((s) => s.id);
    }

    const payment = await this.prisma.payment.create({
      data: {
        clientId: data.clientId,
        userId: data.userId,
        amount: data.amount,
        notes: data.notes,
        sales: {
          createMany: {
            data: data.saleIds.map((saleId) => ({ saleId })),
          },
        },
      },
      include: {
        sales: { include: { sale: true } },
      },
    });

    for (const saleId of data.saleIds) {
      const sale = await this.prisma.sale.findUnique({
        where: { id: saleId },
        include: { payments: true },
      });
      if (!sale) continue;

      const totalPaid = await this.getTotalPaidForSale(saleId);
      const saleTotal = Number(sale.total);

      if (totalPaid >= saleTotal) {
        await this.prisma.sale.update({
          where: { id: saleId },
          data: { status: SaleStatus.PAID },
        });
      } else if (totalPaid > 0) {
        await this.prisma.sale.update({
          where: { id: saleId },
          data: { status: SaleStatus.PARTIAL },
        });
      }
    }

    return payment;
  }

  private async getTotalPaidForSale(saleId: string) {
    const salePayments = await this.prisma.salePayment.findMany({
      where: { saleId },
      include: { payment: true },
    });

    return salePayments.reduce((sum, sp) => sum + Number(sp.payment.amount), 0);
  }
}
