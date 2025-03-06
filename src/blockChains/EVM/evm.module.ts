import { Module } from '@nestjs/common';
import { EVMService } from './evm.service';
import { EVMController } from './evm.controller';

@Module({
  providers: [EVMService],
  controllers: [EVMController],
  exports: [EVMService],
})
export class EVMModule {}
