import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SaleStatus } from '@prisma/client';
import { ProductsService } from '../products/products.service';

@Injectable()
export class SalesService {
  constructor(
    private prisma: PrismaService,
    private productsService: ProductsService,
  ) {}

  async findAll(filters: { clientId?: string; status?: string; from?: string; to?: string }) {
    const where: any = {};

    if (filters.clientId) where.clientId = filters.clientId;
    if (filters.status) where.status = filters.status;
    if (filters.from || filters.to) {
      where.createdAt = {};
      if (filters.from) where.createdAt.gte = new Date(filters.from);
      if (filters.to) where.createdAt.lte = new Date(filters.to);
    }

    return this.prisma.sale.findMany({
      where,
      include: {
        client: { select: { id: true, name: true } },
        user: { select: { id: true, name: true } },
        items: true,
        payments: { include: { payment: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  async findOne(id: string) {
    const sale = await this.prisma.sale.findUnique({
      where: { id },
      include: {
        client: { select: { id: true, name: true } },
        user: { select: { id: true, name: true } },
        items: true,
        payments: { include: { payment: true } },
      },
    });
    if (!sale) throw new NotFoundException('Venda não encontrada');
    return sale;
  }

  async create(data: {
    clientId: string;
    userId: string;
    items: Array<{ productId?: string | null; productName: string; quantity: number; unitPrice: number }>;
    notes?: string;
  }) {
    const items = await Promise.all(
      data.items.map(async (item) => {
        let productId = item.productId;

        if (!productId) {
          const product = await this.productsService.findOrCreate(item.productName);
          productId = product.id;
        }

        const quantity = Number(item.quantity);
        const unitPrice = Number(item.unitPrice);
        const subtotal = quantity * unitPrice;

        return { productId, productName: item.productName, quantity, unitPrice, subtotal };
      }),
    );

    const total = items.reduce((sum, item) => sum + item.subtotal, 0);

    return this.prisma.sale.create({
      data: {
        clientId: data.clientId,
        userId: data.userId,
        status: SaleStatus.PENDING,
        total,
        notes: data.notes,
        items: { createMany: { data: items } },
      },
      include: {
        client: { select: { id: true, name: true } },
        items: true,
      },
    });
  }

  async getPendingSales() {
    return this.prisma.sale.findMany({
      where: { status: { in: ['PENDING', 'PARTIAL'] } },
      include: {
        client: { select: { id: true, name: true } },
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(id: string, status: SaleStatus) {
    return this.prisma.sale.update({
      where: { id },
      data: { status },
    });
  }
}
