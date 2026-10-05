import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(search?: string) {
    const where = search
      ? { name: { contains: search, mode: 'insensitive' as const } }
      : {};

    return this.prisma.product.findMany({
      where,
      orderBy: { name: 'asc' },
      take: 50,
    });
  }

  async create(name: string) {
    const existing = await this.prisma.product.findUnique({ where: { name } });
    if (existing) return existing;

    return this.prisma.product.create({ data: { name } });
  }

  async findOrCreate(name: string) {
    const trimmed = name.trim();
    if (!trimmed) throw new Error('Nome do produto inválido');

    const existing = await this.prisma.product.findUnique({ where: { name: trimmed } });
    if (existing) return existing;

    return this.prisma.product.create({ data: { name: trimmed } });
  }
}
