import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { ProxyModel } from './proxy.model';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ProxyService {
  constructor(
    @InjectModel(ProxyModel)
    private readonly proxyRepository: typeof ProxyModel,
  ) {}

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
      return await this.getProxyByUUID(masterProxy.ProxyUUID);
    } catch (error) {
      console.log(error);
    }
  }

  async createProxy(
    ownerId: string,
    proxyData: Partial<ProxyModel>,
    isMasterProxy?: boolean,
  ): Promise<ProxyModel> {
    try {
      const { count: proxyCount } = await this.proxyRepository.findAndCountAll({
        where: { ownerId: ownerId },
      });

      let ProxyComment = proxyData?.ProxyComment || '';
      let ProxyName = proxyData?.ProxyName || 'New proxy';
      if (isMasterProxy) {
        ProxyComment =
          'Ваш мастер-прокси. Через него будут проходить запросы на активности, если у кошелька не указан другой прокси.';
      }
      if (isMasterProxy) {
        ProxyName = 'Master proxy';
      }

      const newProxy = {
        ProxyUUID: uuidv4(),
        ProxyName: ProxyName,
        ProxyId: proxyCount + 1,
        ProxyComment: ProxyComment,
        ProxyIP: proxyData?.ProxyIP || '0.0.0.0',
        ProxyPort: proxyData?.ProxyPort || '00000',
        ProxyUserName: proxyData?.ProxyUserName || 'proxy-username',
        ProxyPassword: proxyData?.ProxyPassword || 'proxy-password',
        ProxyProtocol: proxyData?.ProxyProtocol || 'http', //protocol (http, https, socks5)
        ProxyStatus: proxyData?.ProxyStatus || 'new',
        ownerId: ownerId,
      };
      return await this.proxyRepository.create(newProxy);
    } catch (error) {
      console.log(error);
    }
  }

  async getAllProxies(req: any, pagination: any, queryParameters: any) {
    try {
      const ownerId = req.user.userId;
      const {
        size = 10,
        page = 1,
        sortBy = 'createdAt',
        sortOrder = 'DESC',
      } = pagination;
      const { proxyStatus, proxyName, proxyComment, proxyIp, proxyProtocol } =
        queryParameters;
      const limit = parseInt(size, 10);
      const offset = (parseInt(page, 10) - 1) * limit;

      const whereCondition: any = { ownerId: ownerId };

      if (proxyStatus) whereCondition.ProxyStatus = proxyStatus;
      if (proxyName)
        whereCondition.ProxyName = { [Op.iLike]: `%${proxyName}%` };
      if (proxyComment)
        whereCondition.ProxyComment = { [Op.iLike]: `%${proxyComment}%` };
      if (proxyIp) whereCondition.ProxyIP = proxyIp;
      if (proxyProtocol) whereCondition.ProxyProtocol = proxyProtocol;

      const { count, rows: proxies } =
        await this.proxyRepository.findAndCountAll({
          where: whereCondition,
          offset: offset,
          limit: limit,
          order: [[sortBy, sortOrder]],
        });
      return {
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: parseInt(page, 10),
        pageSize: limit,
        content: proxies,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async getProxyById(ownerId: string, proxyId: number) {
    try {
      const proxy = await this.proxyRepository.findOne({
        where: { ownerId: ownerId, ProxyId: proxyId },
      });
      if (!proxy) {
        return {
          status: 'error',
          message: 'Proxy not found',
        };
      }
      return {
        status: 'success',
        data: proxy,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async getProxyByUUID(proxyUUID: string): Promise<ProxyModel> {
    try {
      return await this.proxyRepository.findOne({
        where: { ProxyUUID: proxyUUID },
      });
    } catch (error) {
      console.log(error);
    }
  }

  async editProxyById(ownerId: string, proxyId: number, proxyData: any) {
    try {
      const [numberOfAffectedRows, affectedRows] =
        await this.proxyRepository.update(proxyData, {
          where: { ownerId: ownerId, ProxyId: proxyId },
          returning: true,
        });

      if (numberOfAffectedRows === 0) {
        return {
          status: 'error',
          message: 'Proxy not found or no changes made',
        };
      }

      return {
        status: 'success',
        data: affectedRows[0],
      };
    } catch (error) {
      console.log(error);
      return {
        status: 'error',
        message: 'An error occurred while updating the proxy',
      };
    }
  }

  async deleteProxyById(ownerId: string, proxyIds: string) {
    try {
      const proxyIdArray = JSON.parse(proxyIds);
      if (proxyIdArray.length === 0) {
        return {
          status: 'error',
          message: 'No proxy IDs provided',
        };
      }

      console.log('proxyIds -> ', proxyIds);
      console.log('proxyIdArray -> ', typeof proxyIdArray[1]);
      const result = await this.proxyRepository.destroy({
        where: {
          ownerId: ownerId,
          ProxyId: {
            [Op.in]: proxyIdArray,
          },
        },
      });
      if (result === 0) {
        return {
          status: 'error',
          message: 'Proxy not found',
        };
      }
      return {
        status: 'success',
        message: `${result} proxies deleted successfully`,
      };
    } catch (error) {
      console.log(error);
      return {
        status: 'error',
        message: 'An error occurred while deleting the proxy',
      };
    }
  }

  async checkProxy(ownerId: string, proxyId: number, proxyProtocol: string) {
    try {
      const proxy = await this.proxyRepository.findOne({
        where: {
          ownerId: ownerId,
          id: proxyId,
          ProxyProtocol: proxyProtocol,
        },
      });

      // потом сделать функцию проверки через API
      if (!proxy) {
        return {
          status: 'error',
          message: 'Proxy not found',
        };
      }
      return {
        status: 'success',
        data: proxy,
      };
    } catch (error) {
      console.log(error);
    }
  }
}
