import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ProxyService } from './proxy.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('proxy')
export class ProxyController {
  constructor(private readonly proxyService: ProxyService) {}

  // получить свой мастер.прокси
  @Get('master')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getMasterProxy(@Req() req) {
    return await this.proxyService.getMasterProxy(req.user.userId);
  }

  // изменить свой мастер.прокси
  @Patch('master')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async editMasterProxy(@Req() req, @Body() proxyData) {
    return await this.proxyService.editMasterProxy(req.user.userId, proxyData);
  }

  // Добавить прокси (создание) create
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  async createProxy(@Req() req, @Body() proxyData) {
    return await this.proxyService.createProxy(
      req.user.userId,
      proxyData,
      false,
    );
  }

  // получить список всех прокси (с фильтрами и пагинацией)
  @Get('all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getAllProxies(
    @Req() req,
    @Query('size') size: number,
    @Query('page') page: number,
    @Query('sortBy') sortBy: string,
    @Query('sortOrder') sortOrder: string,
    @Query('proxyStatus') proxyStatus: string,
    @Query('proxyName') proxyName: string,
    @Query('proxyComment') proxyComment: string,
    @Query('proxyIp') proxyIp: string,
    @Query('proxyProtocol') proxyProtocol: string,
  ) {
    const pagination = { size, page, sortBy, sortOrder };
    const queryParameters = {
      proxyStatus,
      proxyName,
      proxyComment,
      proxyIp,
      proxyProtocol,
    };
    return await this.proxyService.getAllProxies(
      req,
      pagination,
      queryParameters,
    );
  }

  // Получить информацию о конкретном прокси (по id)
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getProxyById(@Req() req, @Query('proxyId') proxyId: number) {
    return await this.proxyService.getProxyById(req.user.userId, proxyId);
  }

  // Обновить прокси по id (статус, и информация)
  @Patch()
  @UseGuards(JwtAuthGuard, RolesGuard)
  async editProxyById(
    @Req() req,
    @Query('proxyId') proxyId: number,
    @Body() proxyData,
  ) {
    return await this.proxyService.editProxyById(
      req.user.userId,
      proxyId,
      proxyData,
    );
  }

  // Удалить прокси по id (и массово по id)
  @Delete()
  @UseGuards(JwtAuthGuard, RolesGuard)
  async deleteProxyById(@Req() req, @Query('proxyIds') proxyIds: string) {
    return await this.proxyService.deleteProxyById(req.user.userId, proxyIds);
  }

  // check proxy - проверка прокси на работоспособность (с указанием id прокси и протоколом)
  @Get('check')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async checkProxy(@Req() req, @Query('proxyId') proxyId: number) {
    return await this.proxyService.checkProxy(req.user.userId, proxyId);
  }
}
