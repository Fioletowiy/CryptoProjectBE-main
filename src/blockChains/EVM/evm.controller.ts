import { Controller, Get, Param } from '@nestjs/common';
import { EVMService } from './evm.service';

@Controller('eth')
export class EVMController {
  constructor(private readonly ethService: EVMService) {}

  @Get('balance/:address')
  async getBalance(@Param('address') address: string) {
    return this.ethService.getBalance(address);
  }

  @Get('send/:from/:to/:amount')
  async sendTransaction(
    @Param('from') from: string,
    @Param('to') to: string,
    @Param('amount') amount: number,
  ) {
    return this.ethService.sendTransaction(from, to, amount);
  }
}
