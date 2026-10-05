import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { Audit } from '../../common/decorators/audit.decorator';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  async findAll(@Query('search') search?: string) {
    return this.productsService.findAll(search);
  }

  @Post()
  @Permissions('products:create')
  @Audit('PRODUCT_CREATED', 'Product')
  async create(@Body() dto: { name: string }) {
    return this.productsService.create(dto.name);
  }
}
