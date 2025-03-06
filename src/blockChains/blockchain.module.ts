import { Module } from '@nestjs/common';
import { BNBModule } from './BNB/bnb.module';
import { EVMModule } from './EVM/evm.module';

@Module({
  imports: [BNBModule, EVMModule],
  exports: [BNBModule, EVMModule],
})
export class BlockchainModule {}
