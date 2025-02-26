import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModel } from './users.model';
import { WalletsModel } from 'src/wallets/wallets.model';
import { UserWallets } from 'src/wallets/user-wallets.model';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    SequelizeModule.forFeature([UsersModel, WalletsModel, UserWallets]),
  ],
  exports: [UsersService],
})
export class UsersModule {}
