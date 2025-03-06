import { Module } from '@nestjs/common';
import { BNBService } from './bnb.sevice';
import { BNBController } from './bnb.controller';

@Module({
  providers: [BNBService],
  controllers: [BNBController],
  exports: [BNBService],
})
export class BNBModule {}
