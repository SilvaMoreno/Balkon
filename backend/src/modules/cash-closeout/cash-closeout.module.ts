import { Module } from '@nestjs/common';
import { CashCloseoutService } from './cash-closeout.service';
import { CashCloseoutController } from './cash-closeout.controller';

@Module({
  controllers: [CashCloseoutController],
  providers: [CashCloseoutService],
})
export class CashCloseoutModule {}
