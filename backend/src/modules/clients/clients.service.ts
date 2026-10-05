import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) {}

  async findAll(search?: string) {
    const where: Prisma.ClientWhereInput = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as Prisma.QueryMode } },
            { phone: { contains: search } },
            { nif: { contains: search } },
          ],
        }
      : {};

    return this.prisma.client.findMany({
      where,
      orderBy: { name: 'asc' },
      include: {
        _count: { select: { sales: true } },
      },
    });
  }

  async findOne(id: string) {
    const client = await this.prisma.client.findUnique({
      where: { id },
      include: {
        sales: {
          include: { items: true, payments: true },
          orderBy: { createdAt: 'desc' },
        },
        payments: { orderBy: { createdAt: 'desc' } },
      },
    });
    if (!client) throw new NotFoundException('Cliente não encontrado');
    return client;
  }

  async create(data: { name: string; phone?: string; address?: string; nif?: string; notes?: string }) {
    if (!data.name?.trim()) throw new Error('Nome é obrigatório');

    return this.prisma.client.create({ data });
  }

  async update(id: string, data: { name?: string; phone?: string; address?: string; nif?: string; notes?: string }) {
    const client = await this.prisma.client.findUnique({ where: { id } });
    if (!client) throw new NotFoundException('Cliente não encontrado');

    return this.prisma.client.update({ where: { id }, data });
  }

  async getDebts(id: string) {
    const client = await this.prisma.client.findUnique({
      where: { id },
      include: {
        sales: {
          where: { status: { in: ['PENDING', 'PARTIAL'] } },
          include: { payments: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    if (!client) throw new NotFoundException('Cliente não encontrado');

    const unpaidSales = client.sales.map((sale) => {
      const paidAmount = sale.payments.reduce((sum, sp) => sum + Number(sp.saleId ? 0 : 0), 0);
      return { ...sale, paidAmount: Number(sale.payments.length > 0 ? sale.total : 0) };
    });

    return { client, unpaidSales };
  }

  async getDebtSummary(id: string) {
    const client = await this.prisma.client.findUnique({ where: { id } });
    if (!client) throw new NotFoundException('Cliente não encontrado');

    const sales = await this.prisma.sale.findMany({
      where: { clientId: id, status: { in: ['PENDING', 'PARTIAL'] } },
      include: { payments: true },
    });

    const totalDebt = sales.reduce((sum, s) => sum + Number(s.total), 0);
    const totalPaid = sales.reduce((sum, s) => {
      const salePayments = s.payments.reduce((sp, p) => sp + Number(s.total), 0);
      return sum + salePayments;
    }, 0);

    return {
      totalDebt: totalDebt - totalPaid,
      totalSales: sales.length,
      pendingSales: sales.filter((s) => s.status === 'PENDING').length,
      partialSales: sales.filter((s) => s.status === 'PARTIAL').length,
    };
  }
}
