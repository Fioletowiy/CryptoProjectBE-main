import { Controller, Get, Param } from '@nestjs/common';
import { BNBService } from './bnb.sevice';

@Controller('bnb')
export class BNBController {
  constructor(private readonly bnbService: BNBService) {}

  @Get('balance/:address')
  async getBalance(@Param('address') address: string) {
    return this.bnbService.getBalance(address);
  }

  @Get('send/:from/:to/:amount')
  async sendTransaction(
    @Param('from') from: string,
    @Param('to') to: string,
    @Param('amount') amount: number,
  ) {
    return this.bnbService.sendTransaction(from, to, amount);
  }
}
