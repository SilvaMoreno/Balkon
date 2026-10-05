import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async log(entry: {
    action: string;
    entityType: string;
    entityId?: string;
    userId?: string;
    details?: any;
    outcome: 'SUCCESS' | 'FAILURE';
    duration?: number;
  }) {
    try {
      await this.prisma.auditLog.create({ data: entry });
    } catch (err) {
      console.error('Audit log write failed:', err);
    }
  }

  async findAll(filters: { userId?: string; action?: string; from?: string; to?: string }) {
    const where: any = {};

    if (filters.userId) where.userId = filters.userId;
    if (filters.action) where.action = filters.action;
    if (filters.from || filters.to) {
      where.createdAt = {};
      if (filters.from) where.createdAt.gte = new Date(filters.from);
      if (filters.to) where.createdAt.lte = new Date(filters.to);
    }

    return this.prisma.auditLog.findMany({
      where,
      include: { user: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
  }
}
