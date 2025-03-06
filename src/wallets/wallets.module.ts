import { Module } from '@nestjs/common';
import { PostsService } from './wallets.service';
import { PostsController } from './wallets.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { WalletsModel } from './models/wallets.model';
import { UserWallets } from './models/user-wallets.model';
import { UsersModel } from 'src/users/users.model';
import { WalletAddressesModel } from './models/walletsAddresses.model';
import { ProxyModel } from '../proxy/proxy.model';
import { BlockchainModule } from 'src/blockChains/blockchain.module';
import { ProxyModule } from 'src/proxy/proxy.module';

@Module({
  providers: [PostsService],
  controllers: [PostsController],
  imports: [
    BlockchainModule,
    ProxyModule,
    SequelizeModule.forFeature([
      WalletsModel,
      UserWallets,
      UsersModel,
      ProxyModel,
      WalletAddressesModel,
    ]),
  ],
})
export class PostsModule {}
