import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ProxyModel } from './proxy.model';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ProxyService {
  constructor(
    @InjectModel(ProxyModel)
    private readonly proxyRepository: typeof ProxyModel,
  ) {}

  async createProxy(
    ownerId: string,
    isMasterProxy?: boolean,
  ): Promise<ProxyModel> {
    try {
      const newProxy = {
        ProxyUUID: uuidv4(),
        ProxyName: isMasterProxy ? 'Master proxy' : 'New proxy',
        ProxyIP: '0.0.0.0',
        ProxyPort: '00000',
        ProxyUserName: 'proxy-username',
        ProxyPassword: 'proxy-password',
        ProxyProtocol: 'protocol (http, https, socks5)',
        ProxyStatus: 'new',
        ownerId: ownerId,
      };
      return await this.proxyRepository.create(newProxy);
    } catch (error) {
      console.log(error);
    }
  }

  async editProxy(
    proxyUUID: string,
    proxyData: Partial<ProxyModel>,
    isMasterProxy?: boolean,
  ): Promise<ProxyModel> {
    try {
      if (isMasterProxy) {
        proxyData = { ...proxyData, ProxyName: 'Master proxy' };
      }
      await this.proxyRepository.update(proxyData, {
        where: { ProxyUUID: proxyUUID },
      });
      return await this.findOne(proxyUUID);
    } catch (error) {
      console.log(error);
    }
  }

  async findOne(proxyUUID: string): Promise<ProxyModel> {
    try {
      return await this.proxyRepository.findOne({
        where: { ProxyUUID: proxyUUID },
      });
    } catch (error) {
      console.log(error);
    }
  }

  async getMasterProxy(ownerId: string): Promise<ProxyModel> {
    try {
      return await this.proxyRepository.findOne({
        where: { ownerId: ownerId, ProxyName: 'Master proxy' },
      });
    } catch (error) {
      console.log(error);
    }
  }

  async editMasterProxy(
    ownerId: string,
    proxyData: Partial<ProxyModel>,
  ): Promise<ProxyModel> {
    try {
      const masterProxy = await this.getMasterProxy(ownerId);
      await this.proxyRepository.update(proxyData, {
        where: { ProxyUUID: masterProxy.ProxyUUID },
      });
      return await this.findOne(masterProxy.ProxyUUID);
    } catch (error) {
      console.log(error);
    }
  }

  async delete(proxyUUID: string): Promise<void> {
    await this.proxyRepository.destroy({ where: { ProxyUUID: proxyUUID } });
  }
}
