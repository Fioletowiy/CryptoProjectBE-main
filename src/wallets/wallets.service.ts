import { Injectable } from '@nestjs/common';
import { WalletsModel } from './wallets.model';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/sequelize';
import { WalletsDto } from './dto/wallets.dto';
import { v4 as uuidv4 } from 'uuid';
import { Op } from 'sequelize';
import fetch from 'node-fetch';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(WalletsModel) private WalletsRepository: typeof WalletsModel,
    private configService: ConfigService,
  ) {}

  async getUserAccounts(req) {
    const userId = req.user.userId;
    try {
      if (userId === undefined) {
        return 'Access denied';
      }
      const accounts = await this.WalletsRepository.findAll({
        where: { ownerId: userId },
      });
      const steamAccounts = accounts.map((account) => {
        return {
          steamId: account.steamId,
          steamName: account.steamName,
          avatar: account.steamAvatar,
          accountStatus: account.accountStatus,
          proxyStatus: account.proxyStatus,
        };
      });
      const responce = {
        steamAccounts: steamAccounts,
        TotalAmmounts: steamAccounts.length,
      };
      return responce;
    } catch (error) {
      console.log(error);
    }
    return 'error';
  }

  async getAccounts() {
    const accounts = await this.WalletsRepository.findAll();
    const responce = accounts.map((account) => {
      return {
        steamId: account.steamId,
        steamName: account.steamName,
        avatar: account.steamAvatar,
        accountStatus: account.accountStatus,
        proxyStatus: account.proxyStatus,
      };
    });
    return responce;
  }

  async createAccount(postData: WalletsDto, req) {
    const accountFromDB = await this.WalletsRepository.findOne({
      where: { steamId: postData.steamId },
    });
    if (accountFromDB) {
      console.log(accountFromDB);
      return 'Account already exists';
    }
    const newAccount = postData;
    newAccount['groupId'] = uuidv4();
    newAccount['ownerId'] = req.user.userId;
    newAccount['steamAvatar'] = 'url//ewfewfe';

    const steamApiKey = this.configService.get<string>('STEAM_API_KEY');
    const steamApiUrl = this.configService.get<string>('STEAM_API_URL');
    const steamProfileUrl = `${steamApiUrl}/?key=${steamApiKey}&steamids=${newAccount.steamId}`;
    try {
      const steamProfileResponse = await fetch(steamProfileUrl);
      const steamProfileData = await steamProfileResponse.json();
      newAccount['steamAvatar'] =
        steamProfileData.response.players[0].avatarfull;
      newAccount['steamName'] =
        steamProfileData.response.players[0].personaname;
    } catch (error) {
      newAccount['steamAvatar'] = 'default-avatar';
      newAccount['steamName'] = 'default-name';
    }

    const post = await this.WalletsRepository.create(newAccount);
    return post;
  }

  async deleteUserAccount(accountsIds: string[], req) {
    const userId = req.user.userId;
    try {
      const result = await this.WalletsRepository.destroy({
        where: {
          ownerId: userId,
          steamId: {
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

  async editUserAccount(accountId: string, postData: WalletsDto, req) {
    const userId = req.user.userId;
    if (postData.steamId) {
      delete postData.steamId;
    }
    try {
      const result = await this.WalletsRepository.update(postData, {
        where: {
          ownerId: userId,
          steamId: accountId,
        },
      });
      if (result[0] === 0) {
        return 'No accounts found';
      }
      return `${result} accounts updated successfully`;
    } catch (error) {
      console.log(error);
      return 'error';
    }
  }
}
