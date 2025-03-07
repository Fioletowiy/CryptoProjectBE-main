import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { ProxyModel } from './proxy.model';
import { v4 as uuidv4 } from 'uuid';
import { HttpsProxyAgent } from 'https-proxy-agent';
import fetch from 'node-fetch';
import { SocksProxyAgent } from 'socks-proxy-agent';

@Injectable()
export class ProxyService {
  constructor(
    @InjectModel(ProxyModel)
    private readonly proxyRepository: typeof ProxyModel,
  ) {}

  async getMasterProxy(ownerId: string, systemRequest?: boolean) {
    try {
      const masterProxy = await this.proxyRepository.findOne({
        where: { ownerId: ownerId, ProxyName: 'Master proxy' },
      });

      if (systemRequest) {
        return masterProxy;
      }

      return {
        ProxyId: masterProxy.ProxyId,
        ProxyName: masterProxy.ProxyName,
        ProxyComment: masterProxy.ProxyComment,
        ProxyIP: masterProxy.ProxyIP,
        ProxyPort: masterProxy.ProxyPort,
        ProxyUserName: masterProxy.ProxyUserName,
        ProxyPassword: masterProxy.ProxyPassword,
        ProxyProtocol: masterProxy.ProxyProtocol,
        ProxyStatus: masterProxy.ProxyStatus,
      };
    } catch (error) {
      console.log(error);
      return {
        status: 'error',
        message: 'Server error',
      };
    }
  }

  async editMasterProxy(ownerId: string, proxyData: Partial<ProxyModel>) {
    try {
      const masterProxy = await this.getMasterProxy(ownerId, true);
      const dataToUpdate = {};

      const fieldsToUpdate = [
        'ProxyComment',
        'ProxyIP',
        'ProxyPort',
        'ProxyUserName',
        'ProxyPassword',
        'ProxyProtocol',
        'ProxyStatus',
      ];

      fieldsToUpdate.forEach((field) => {
        if (proxyData[field] !== undefined) {
          dataToUpdate[field] = proxyData[field];
        }
      });

      await this.proxyRepository.update(dataToUpdate, {
        where: { ProxyUUID: (masterProxy as ProxyModel).ProxyUUID },
      });
      return {
        status: 'success',
        message: 'Master proxy updated successfully',
      };
    } catch (error) {
      console.log(error);
      return {
        status: 'error',
        message: 'Server error',
      };
    }
  }

  async createProxy(
    ownerId: string,
    proxyData: Partial<ProxyModel>,
    isMasterProxy?: boolean,
    isSystemRequest?: boolean,
  ) {
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
      const createdProxy = await this.proxyRepository.create(newProxy);

      if (isSystemRequest) {
        return createdProxy;
      }

      return {
        ProxyId: createdProxy.ProxyId,
        ProxyName: createdProxy.ProxyName,
        ProxyComment: createdProxy.ProxyComment,
        ProxyIP: createdProxy.ProxyIP,
        ProxyPort: createdProxy.ProxyPort,
        ProxyUserName: createdProxy.ProxyUserName,
        ProxyPassword: createdProxy.ProxyPassword,
        ProxyProtocol: createdProxy.ProxyProtocol,
        ProxyStatus: createdProxy.ProxyStatus,
      };
    } catch (error) {
      console.log(error);
      return {
        status: 'error',
        message: 'Server error',
      };
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
      return {
        status: 'error',
        message: 'Server error',
      };
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
        data: {
          ProxyId: proxy.ProxyId,
          ProxyName: proxy.ProxyName,
          ProxyComment: proxy.ProxyComment,
          ProxyIP: proxy.ProxyIP,
          ProxyPort: proxy.ProxyPort,
          ProxyUserName: proxy.ProxyUserName,
          ProxyPassword: proxy.ProxyPassword,
          ProxyProtocol: proxy.ProxyProtocol,
          ProxyStatus: proxy.ProxyStatus,
        },
      };
    } catch (error) {
      console.log(error);
      return {
        status: 'error',
        message: 'Server error',
      };
    }
  }

  async getProxyByUUID(proxyUUID: string) {
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
      if (proxyId === 1) {
        this.editMasterProxy(ownerId, proxyData);
      }

      const dataToUpdate = {};

      const fieldsToUpdate = [
        'ProxyName',
        'ProxyComment',
        'ProxyIP',
        'ProxyPort',
        'ProxyUserName',
        'ProxyPassword',
        'ProxyProtocol',
        'ProxyStatus',
      ];

      fieldsToUpdate.forEach((field) => {
        if (proxyData[field] !== undefined) {
          dataToUpdate[field] = proxyData[field];
        }
      });

      const [numberOfAffectedRows, affectedRows] =
        await this.proxyRepository.update(dataToUpdate, {
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
      const proxyIdArray = JSON.parse(proxyIds).filter(
        (id) => !isNaN(id) && id > 1,
      );
      if (proxyIdArray.length === 0) {
        return {
          status: 'error',
          message: 'No proxy IDs provided',
        };
      }

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

  async checkProxy(ownerId: string, proxyId: number) {
    try {
      const proxy = await this.proxyRepository.findOne({
        where: {
          ownerId: ownerId,
          ProxyId: proxyId,
        },
      });
      if (!proxy) {
        return {
          status: 'error',
          message: 'Proxy not found',
        };
      }
      let agent;
      if (proxy.ProxyProtocol === 'socks5') {
        const proxySocksUrl = `socks5://${proxy.ProxyUserName}:${proxy.ProxyPassword}@${proxy.ProxyIP}:${proxy.ProxyPort}`;
        agent = new SocksProxyAgent(proxySocksUrl);
      } else {
        const proxyHttpUrl = `http://${proxy.ProxyUserName}:${proxy.ProxyPassword}@${proxy.ProxyIP}:${proxy.ProxyPort}`;
        agent = new HttpsProxyAgent(proxyHttpUrl);
      }
      try {
        const response = await fetch('https://api.ipify.org?format=json', {
          method: 'GET',
          timeout: 5000,
          agent: agent,
        });

        if (response.ok) {
          const data = await response.json();
          return {
            status: 'success',
            message: `Proxy is working, your IP: ${data.ip}`,
          };
        }
      } catch (error) {
        console.log('Primary check failed, trying backup:', error.message);
        try {
          const backupResponse = await fetch('https://www.google.com', {
            method: 'GET',
            timeout: 5000,
            agent: agent,
          });

          if (backupResponse.ok) {
            return {
              status: 'success',
              message: 'Proxy is working, but primary check failed',
            };
          }
        } catch (backupError) {
          console.log('Backup check failed:', backupError.message);
        }
      }
      return {
        status: 'error',
        message: 'Proxy check failed',
      };
    } catch (error) {
      console.log(error);
      return {
        status: 'error',
        message: 'Server error',
      };
    }
  }
}
