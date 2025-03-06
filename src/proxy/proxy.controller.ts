import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { ProxyService } from './proxy.service';
import { ProxyModel } from './proxy.model';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('proxy')
export class ProxyController {
  constructor(private readonly proxyService: ProxyService) {}

  @Get('master')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getMasterProxy(@Req() req): Promise<ProxyModel> {
    return await this.proxyService.getMasterProxy(req.user.userId);
  }

  @Patch('master')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async editMasterProxy(@Req() req, @Body() proxyData): Promise<ProxyModel> {
    return await this.proxyService.editMasterProxy(req.user.userId, proxyData);
  }
}
