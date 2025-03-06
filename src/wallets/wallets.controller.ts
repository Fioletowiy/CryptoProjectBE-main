import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Req,
  Delete,
  Query,
} from '@nestjs/common';
import { PostsService } from './wallets.service';
import { WalletsDto } from './dto/wallets.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('wallets')
export class PostsController {
  constructor(private postsService: PostsService) {}

  // todo - добавить пагинацию
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('creator')
  async getUserWallets(
    @Req() req,
    @Query('size') size: number,
    @Query('page') page: number,
    @Query('proxyStatus') proxyStatus: string,
    @Query('sortBy') sortBy: string,
    @Query('sortOrder') sortOrder: string,
  ) {
    const answer = await this.postsService.getUserWallets({
      ...req,
      query: { size, page, proxyStatus, sortBy, sortOrder },
    });
    return answer;
  }

  @Get('test')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('creator')
  async testFoo(@Query('key') key: string) {
    const a = await this.postsService.testFoo(key);
    return a;
  }

  // todo - добавить массовое создание
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('creator')
  async generateNewWallets(@Body() postData: WalletsDto, @Req() req) {
    const answer = this.postsService.generateNewWallets(postData, req);
    return answer;
  }

  // @Patch()
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('creator')
  // async updateAccount(
  //   @Query('accountId') accountId: string,
  //   @Body() postData: WalletsDto,
  //   @Req() req,
  // ) {
  //   const answer = this.postsService.editUserAccount(accountId, postData, req);
  //   return answer;
  // }

  @Delete()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('creator')
  async deleteUserAccounts(@Query('accountIds') accountsIds, @Req() req) {
    const idsArray = accountsIds.split(',').map((id: string) => id.trim()); // Преобразуем строку в массив и удаляем пробелы
    const answer = this.postsService.deleteUserAccount(idsArray, req);
    return answer;
  }
}
