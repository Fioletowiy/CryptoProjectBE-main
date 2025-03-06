import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PostsModule } from './wallets/wallets.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import configurations from './configurations';
import { UsersModel } from './users/users.model';
import { WalletsModel } from './wallets/models/wallets.model';
import { UserWallets } from './wallets/models/user-wallets.model';
import { AuthModule } from './auth/auth.module';
import { AuthorizationMiddleware } from './AuthorizationMiddleware';
import { ProxyModel } from './proxy/proxy.model';
import { WalletAddressesModel } from './wallets/models/walletsAddresses.model';
import { BlockchainModule } from './blockChains/blockchain.module';

@Module({
  controllers: [],
  providers: [],
  imports: [
    UsersModule,
    BlockchainModule,
    PostsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configurations],
    }),
    AuthModule,
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        dialect: 'postgres',
        host: configService.get('POSTGRESQL_HOST'),
        port: Number(configService.get('POSTGRESQL_PORT')),
        username: configService.get('POSTGRESQL_USERNAME'),
        password: configService.get('POSTGRESQL_PASSWORD'),
        database: configService.get('POSTGRESQL_DATABASE'),
        models: [
          UsersModel,
          WalletsModel,
          WalletAddressesModel,
          UserWallets,
          ProxyModel,
        ],
        autoLoadModels: false,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthorizationMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
