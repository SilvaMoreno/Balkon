import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { CashCloseoutService } from './cash-closeout.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { Audit } from '../../common/decorators/audit.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('cash-closeout')
export class CashCloseoutController {
  constructor(private cashCloseoutService: CashCloseoutService) {}

  @Get()
  async findAll() {
    return this.cashCloseoutService.findAll();
  }

  @Post()
  @Permissions('cash-closeout:create')
  @Audit('CASH_CLOSEOUT_CREATED', 'CashCloseout')
  async create(
    @Body() dto: { cashAmount: number; cardAmount: number; notes?: string },
    @CurrentUser() user: any,
  ) {
    return this.cashCloseoutService.create({ ...dto, userId: user.id });
  }
}
