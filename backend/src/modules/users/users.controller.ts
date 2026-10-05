import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { Audit } from '../../common/decorators/audit.decorator';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @Permissions('users:manage')
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Permissions('users:manage')
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Post()
  @Permissions('users:manage')
  @Audit('USER_CREATED', 'User')
  async create(@Body() dto: any) {
    return this.usersService.create(dto);
  }

  @Put(':id')
  @Permissions('users:manage')
  @Audit('USER_UPDATED', 'User')
  async update(@Param('id') id: string, @Body() dto: any) {
    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  @Permissions('users:manage')
  @Audit('USER_DELETED', 'User')
  async remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
