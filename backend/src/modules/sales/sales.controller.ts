import { Controller, Get, Post, Param, Body, Query, UseGuards } from '@nestjs/common';
import { SalesService } from './sales.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { Audit } from '../../common/decorators/audit.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('sales')
export class SalesController {
  constructor(private salesService: SalesService) {}

  @Get()
  async findAll(@Query() filters: { clientId?: string; status?: string; from?: string; to?: string }) {
    return this.salesService.findAll(filters);
  }

  @Get('pending')
  async getPending() {
    return this.salesService.getPendingSales();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.salesService.findOne(id);
  }

  @Post()
  @Permissions('sales:create')
  @Audit('SALE_CREATED', 'Sale')
  async create(
    @Body() dto: {
      clientId: string;
      items: Array<{ productId?: string | null; productName: string; quantity: number; unitPrice: number }>;
      notes?: string;
    },
    @CurrentUser() user: any,
  ) {
    return this.salesService.create({ ...dto, userId: user.id });
  }
}
