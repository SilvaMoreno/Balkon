import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { Audit } from '../../common/decorators/audit.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Get()
  async findAll(@Query() filters: { clientId?: string; from?: string; to?: string }) {
    return this.paymentsService.findAll(filters);
  }

  @Post()
  @Permissions('payments:create')
  @Audit('PAYMENT_CREATED', 'Payment')
  async create(
    @Body() dto: { clientId: string; amount: number; saleIds?: string[]; notes?: string },
    @CurrentUser() user: any,
  ) {
    return this.paymentsService.create({ ...dto, userId: user.id });
  }
}
