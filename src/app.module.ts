import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PostsModule } from './wallets/wallets.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import configurations from './configurations';
import { UsersModel } from './users/users.model';
import { WalletsModel } from './wallets/wallets.model';
import { UserWallets } from './wallets/user-wallets.model';
import { AuthModule } from './auth/auth.module';
import { AuthorizationMiddleware } from './AuthorizationMiddleware';

@Module({
  controllers: [],
  providers: [],
  imports: [
    UsersModule,
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
        models: [UsersModel, WalletsModel, UserWallets],
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
