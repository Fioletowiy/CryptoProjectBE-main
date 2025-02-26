import { Module } from '@nestjs/common';
import { PostsService } from './wallets.service';
import { PostsController } from './wallets.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { WalletsModel } from './wallets.model';
import { UserWallets } from './user-wallets.model';
import { UsersModel } from 'src/users/users.model';

@Module({
  providers: [PostsService],
  controllers: [PostsController],
  imports: [
    SequelizeModule.forFeature([WalletsModel, UserWallets, UsersModel]),
  ],
})
export class PostsModule {}
