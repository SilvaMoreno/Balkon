import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getSummary() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const [monthlySales, monthlyStockPurchases, totalPendingDebt, todayCashCloseout, salesCount, clientsCount] =
      await Promise.all([
        this.prisma.sale.aggregate({
          where: { createdAt: { gte: startOfMonth } },
          _sum: { total: true },
        }),
        this.prisma.stockPurchase.aggregate({
          where: { date: { gte: startOfMonth } },
          _sum: { amount: true },
        }),
        this.prisma.sale.aggregate({
          where: { status: { in: ['PENDING', 'PARTIAL'] } },
          _sum: { total: true },
        }),
        this.prisma.cashCloseout.findFirst({
          where: { createdAt: { gte: startOfToday } },
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.sale.count({ where: { createdAt: { gte: startOfToday } } }),
        this.prisma.client.count(),
      ]);

    return {
      totalSalesMonth: Number(monthlySales._sum.total || 0),
      totalExpensesMonth: Number(monthlyStockPurchases._sum.amount || 0),
      balance: Number(monthlySales._sum.total || 0) - Number(monthlyStockPurchases._sum.amount || 0),
      totalPendingDebt: Number(totalPendingDebt._sum.total || 0),
      todaySales: salesCount,
      todayCashCloseout: todayCashCloseout
        ? { cashAmount: Number(todayCashCloseout.cashAmount), cardAmount: Number(todayCashCloseout.cardAmount), total: Number(todayCashCloseout.totalCounted) }
        : null,
      totalClients: clientsCount,
    };
  }

  async getMonthlyData(year?: number) {
    const targetYear = year || new Date().getFullYear();

    const monthlyData: Array<{ month: number; sales: number; expenses: number }> = [];

    for (let month = 0; month < 12; month++) {
      const startOfMonth = new Date(targetYear, month, 1);
      const endOfMonth = new Date(targetYear, month + 1, 1);

      const [sales, expenses] = await Promise.all([
        this.prisma.sale.aggregate({
          where: { createdAt: { gte: startOfMonth, lt: endOfMonth } },
          _sum: { total: true },
        }),
        this.prisma.stockPurchase.aggregate({
          where: { date: { gte: startOfMonth, lt: endOfMonth } },
          _sum: { amount: true },
        }),
      ]);

      monthlyData.push({
        month: month + 1,
        sales: Number(sales._sum.total || 0),
        expenses: Number(expenses._sum.amount || 0),
      });
    }

    return monthlyData;
  }
}
