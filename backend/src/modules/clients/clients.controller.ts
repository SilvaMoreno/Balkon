import { Controller, Get, Post, Put, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { Audit } from '../../common/decorators/audit.decorator';
import { Public } from '../../common/decorators/public.decorator';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('clients')
export class ClientsController {
  constructor(private clientsService: ClientsService) {}

  @Get()
  async findAll(@Query('search') search?: string) {
    return this.clientsService.findAll(search);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.clientsService.findOne(id);
  }

  @Public()
  @Post()
  @Audit('CLIENT_CREATED', 'Client')
  async create(@Body() dto: { name: string; phone?: string; address?: string; nif?: string; notes?: string }) {
    return this.clientsService.create(dto);
  }

  @Put(':id')
  @Audit('CLIENT_UPDATED', 'Client')
  async update(@Param('id') id: string, @Body() dto: any) {
    return this.clientsService.update(id, dto);
  }

  @Get(':id/debts')
  async getDebts(@Param('id') id: string) {
    return this.clientsService.getDebtSummary(id);
  }
}
