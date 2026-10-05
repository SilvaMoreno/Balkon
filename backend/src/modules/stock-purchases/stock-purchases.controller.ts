import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { StockPurchasesService } from './stock-purchases.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { Audit } from '../../common/decorators/audit.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('stock-purchases')
export class StockPurchasesController {
  constructor(private stockPurchasesService: StockPurchasesService) {}

  @Get()
  async findAll() {
    return this.stockPurchasesService.findAll();
  }

  @Post()
  @Permissions('stock-purchases:create')
  @Audit('STOCK_PURCHASE_CREATED', 'StockPurchase')
  async create(
    @Body() dto: { description: string; amount: number; date?: string; notes?: string },
    @CurrentUser() user: any,
  ) {
    return this.stockPurchasesService.create({ ...dto, userId: user.id });
  }
}
