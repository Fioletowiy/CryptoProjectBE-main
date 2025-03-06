import {
  Model,
  Table,
  Column,
  DataType,
  ForeignKey,
  HasOne,
  BelongsTo,
} from 'sequelize-typescript';
import { WalletsAttrs } from '../types/accounts.interface.type';
import { UsersModel } from '../../users/users.model';
import { WalletAddressesModel } from './walletsAddresses.model';
import { ProxyModel } from '../../proxy/proxy.model';

@Table({ tableName: 'wallets' })
export class WalletsModel extends Model<WalletsModel, WalletsAttrs> {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  walletId: number;

  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
  })
  walletUUID: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  walletSecret: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  mnemonicPhrase: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  walletName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  walletStatus: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  proxyStatus: string;

  @Column({
    type: DataType.DATE,
  })
  createdAt: Date;

  @Column({
    type: DataType.DATE,
  })
  updatedAt: Date;

  @ForeignKey(() => UsersModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  ownerId: string;

  @ForeignKey(() => ProxyModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  proxyUUID: string;

  @BelongsTo(() => ProxyModel)
  proxy: ProxyModel;

  @HasOne(() => WalletAddressesModel)
  addresses: WalletAddressesModel;
}
