import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProxyService } from './proxy.service';
import { ProxyModel } from './proxy.model';
import { ProxyController } from './proxy.controller';

@Module({
  imports: [SequelizeModule.forFeature([ProxyModel])],
  providers: [ProxyService],
  controllers: [ProxyController],
  exports: [ProxyService],
})
export class ProxyModule {}
