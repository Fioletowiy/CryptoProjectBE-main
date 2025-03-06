import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModel } from './users.model';
import { WalletsModel } from 'src/wallets/models/wallets.model';
import { UserWallets } from 'src/wallets/models/user-wallets.model';
import { ProxyModel } from 'src/proxy/proxy.model';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    SequelizeModule.forFeature([
      UsersModel,
      WalletsModel,
      UserWallets,
      ProxyModel,
    ]),
  ],
  exports: [UsersService],
})
export class UsersModule {}
