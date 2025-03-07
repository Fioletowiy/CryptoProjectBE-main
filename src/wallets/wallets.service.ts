import { Injectable } from '@nestjs/common';
import { WalletsModel } from './models/wallets.model';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/sequelize';
// import { WalletsDto } from './dto/wallets.dto';
import { v4 as uuidv4 } from 'uuid';
import { Op } from 'sequelize';
import { ProxyModel } from '../proxy/proxy.model';
import { WalletAddressesModel } from './models/walletsAddresses.model';
import { EVMService } from 'src/blockChains/EVM/evm.service';
import { ProxyService } from 'src/proxy/proxy.service';
// import fetch from 'node-fetch';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(WalletsModel) private WalletsRepository: typeof WalletsModel,
    @InjectModel(WalletAddressesModel)
    private AddressesRepository: typeof WalletAddressesModel,
    private readonly proxyService: ProxyService,
    private readonly evmService: EVMService,
    private configService: ConfigService,
  ) {}

  async testFoo(key: string) {
    try {
      return key;
    } catch (error) {
      console.log(error);
    }
  }

  async generateNewWallets(postData, req) {
    const userId = req.user.userId;
    const count = postData.count;
    const neededAddresses = postData.addresses;
    const { count: walletCounts } =
      await this.WalletsRepository.findAndCountAll({
        where: { ownerId: req.user.userId },
      });

    for (let i = 0; i < count; i++) {
      const wallet = await this.evmService.generateNewWallet();
      const EthEvmAddress =
        await this.evmService.getWalletAddressFromPrivateKey(wallet.privateKey);

      if (wallet.status === 'success') {
        const walletId = walletCounts + i + 1;

        //Todo реализовать функционал подтягивания прокси

        const masterProxy = await this.proxyService.getMasterProxy(
          userId,
          true,
        );

        const newWallet = {
          walletId: walletId,
          walletUUID: uuidv4(),
          walletSecret: wallet.privateKey,
          walletName: 'Cypto wallet',
          walletStatus: 'New',
          mnemonicPhrase: wallet.mnemonicPhrase,
          proxyStatus: 'default-status',
          proxyUUID: (masterProxy as ProxyModel).ProxyUUID, // Используем идентификатор созданного прокси
          ownerId: req.user.userId,
        };

        await this.WalletsRepository.create(newWallet);

        const addresses = {
          walletUUID: newWallet.walletUUID,
        };
        if (neededAddresses.includes('ETHEVM')) {
          addresses['ETHevm'] = EthEvmAddress;
        }
        if (neededAddresses.includes('TRX')) {
          addresses['TRX'] = 'TRX-address';
        }
        await this.AddressesRepository.create(addresses);
      } else {
        return 'error';
      }
    }
    return 'success';
  }

  async getUserWallets(req) {
    const userId = req.user.userId;
    const {
      size = 10,
      page = 1,
      proxyStatus,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = req.query; // Получаем параметры size и page из query
    const limit = parseInt(size, 10);
    const offset = (parseInt(page, 10) - 1) * limit;

    const whereCondition: any = { ownerId: userId };
    if (proxyStatus) {
      whereCondition.proxyStatus = proxyStatus;
    }

    const whereObject = {
      where: whereCondition,
      limit,
      offset,
      include: [
        { model: WalletAddressesModel, as: 'addresses' },
        { model: ProxyModel, as: 'proxy' },
      ],
    };

    if (sortBy && sortOrder) {
      whereObject['order'] = [[sortBy, sortOrder]];
    }
    console.log(whereObject);
    try {
      if (userId === undefined) {
        return 'Access denied';
      }
      const { count, rows: userWallets } =
        await this.WalletsRepository.findAndCountAll(whereObject);
      const wallets = userWallets.map((account) => {
        return {
          walletId: account.walletId,
          walletName: account.walletName,
          walletStatus: account.walletStatus,
          proxyStatus: account.proxyStatus,
          addresses: account.addresses
            ? {
                BNB: account.addresses.BNB,
                ETHevm: account.addresses.ETHevm,
                TRX: account.addresses.TRX,
              }
            : [],
          proxy: {
            IP: account.proxy.ProxyIP,
            Port: account.proxy.ProxyPort,
          },
        };
      });

      const response = {
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: parseInt(page, 10),
        pageSize: limit,
        content: wallets,
      };
      return response;
    } catch (error) {
      console.log(error);
      return 'error';
    }
  }

  // async createAccount(postData: WalletsDto, req) {
  //   const accountFromDB = await this.WalletsRepository.findOne({
  //     where: { walletUUID: postData.steamId },
  //   });
  //   if (accountFromDB) {
  //     console.log(accountFromDB);
  //     return 'Account already exists';
  //   }
  //   const newAccount = postData;
  //   newAccount['groupId'] = uuidv4();
  //   newAccount['ownerId'] = req.user.userId;
  //   newAccount['steamAvatar'] = 'url//ewfewfe';

  //   const steamApiKey = this.configService.get<string>('STEAM_API_KEY');
  //   const steamApiUrl = this.configService.get<string>('STEAM_API_URL');
  //   const steamProfileUrl = `${steamApiUrl}/?key=${steamApiKey}&steamids=${newAccount.steamId}`;
  //   try {
  //     const steamProfileResponse = await fetch(steamProfileUrl);
  //     const steamProfileData = await steamProfileResponse.json();
  //     newAccount['steamAvatar'] =
  //       steamProfileData.response.players[0].avatarfull;
  //     newAccount['steamName'] =
  //       steamProfileData.response.players[0].personaname;
  //   } catch (error) {
  //     newAccount['steamAvatar'] = 'default-avatar';
  //     newAccount['steamName'] = 'default-name';
  //   }

  //   const post = await this.WalletsRepository.create(newAccount);
  //   return post;
  // }

  async deleteUserAccount(accountsIds: string[], req) {
    const userId = req.user.userId;
    try {
      const result = await this.WalletsRepository.destroy({
        where: {
          ownerId: userId,
          walletUUID: {
            [Op.in]: accountsIds,
          },
        },
      });
      if (result === 0) {
        return 'No accounts found';
      }
      return `${result} accounts deleted successfully`;
    } catch (error) {
      console.log(error);
      return 'error';
    }
  }

  // async editUserAccount(accountId: string, postData: WalletsDto, req) {
  //   const userId = req.user.userId;
  //   if (postData.count) {
  //     delete postData.count;
  //   }
  //   try {
  //     const result = await this.WalletsRepository.update(postData, {
  //       where: {
  //         ownerId: userId,
  //       },
  //     });
  //     if (result[0] === 0) {
  //       return 'No accounts found';
  //     }
  //     return `${result} accounts updated successfully`;
  //   } catch (error) {
  //     console.log(error);
  //     return 'error';
  //   }
  // }
}
