import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get('summary')
  @Permissions('dashboard:read')
  async getSummary() {
    return this.dashboardService.getSummary();
  }

  @Get('monthly')
  @Permissions('dashboard:read')
  async getMonthly(@Query('year') year?: string) {
    return this.dashboardService.getMonthlyData(year ? parseInt(year) : undefined);
  }
}
