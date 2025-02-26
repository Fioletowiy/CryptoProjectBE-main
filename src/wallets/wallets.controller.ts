import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Req,
  Delete,
  Query,
  Patch,
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
  async getUserAccounts(@Req() req) {
    const answer = this.postsService.getUserAccounts(req);
    return answer;
  }

  // todo - добавить массовое создание
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('creator')
  async createAccount(@Body() postData: WalletsDto, @Req() req) {
    const answer = this.postsService.createAccount(postData, req);
    return answer;
  }

  @Patch()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('creator')
  async updateAccount(
    @Query('accountId') accountId: string,
    @Body() postData: WalletsDto,
    @Req() req,
  ) {
    const answer = this.postsService.editUserAccount(accountId, postData, req);
    return answer;
  }

  @Delete()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('creator')
  async deleteUserAccounts(@Query('accountIds') accountsIds, @Req() req) {
    const idsArray = accountsIds.split(',').map((id: string) => id.trim()); // Преобразуем строку в массив и удаляем пробелы
    const answer = this.postsService.deleteUserAccount(idsArray, req);
    return answer;
  }
}
