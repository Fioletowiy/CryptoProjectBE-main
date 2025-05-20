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
  // Получить все кошельки
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

  // Получить кошелёк по id
  @Get('id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('creator')
  async getWalletById(@Query('id') id: string) {
    const answer = await this.postsService.getWalletById(id);
    return answer;
  }

  // Создать новый кошелёк с параметрами
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('creator')
  async createNewWallet(@Body() postData: WalletsDto, @Req() req) {
    const answer = this.postsService.createNewWallet(postData, req);
    return answer;
  }

  // Изменить кошелёк по id
  @Post('edit')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('creator')
  async editWalletById(@Body() postData: WalletsDto, @Req() req) {
    const answer = this.postsService.editWalletById(postData, req);
    return answer;
  }

  // массовая генерация кошельков
  @Post('mass')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('creator')
  async generateNewWallets(@Body() postData: WalletsDto, @Req() req) {
    const answer = this.postsService.generateNewWallets(postData, req);
    return answer;
  }

  // удалить кошельки. не готово
  @Delete()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('creator')
  async deleteUserAccounts(@Query('accountIds') accountsIds, @Req() req) {
    const idsArray = accountsIds.split(',').map((id: string) => id.trim()); // Преобразуем строку в массив и удаляем пробелы
    const answer = this.postsService.deleteUserAccount(idsArray, req);
    return answer;
  }
}
