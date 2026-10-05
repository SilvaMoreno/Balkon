import { Module } from '@nestjs/common';
import { StockPurchasesService } from './stock-purchases.service';
import { StockPurchasesController } from './stock-purchases.controller';

@Module({
  controllers: [StockPurchasesController],
  providers: [StockPurchasesService],
})
export class StockPurchasesModule {}
