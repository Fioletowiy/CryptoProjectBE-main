import {
  Model,
  Table,
  Column,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import { WalletsAttrs } from './types/accounts.interface.type';
import { UsersModel } from '../users/users.model';

@Table({ tableName: 'wallets' })
export class WalletsModel extends Model<WalletsModel, WalletsAttrs> {
  @Column({
    type: DataType.STRING,
    primaryKey: true,
    unique: true,
    allowNull: false,
  })
  steamId: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  steamAvatar: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  steamName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  accountStatus: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  proxyData: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  proxyStatus: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  userAgent: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  cookies: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  authJWT: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  acceptLanguage: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  secChUa: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  groupId: string;

  @Column({
    type: DataType.DATE,
  })
  createdAt: Date;

  @Column({
    type: DataType.DATE,
  })
  updatedAt: Date;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
    field: 'activeSuccessfullCounts',
  })
  activeSuccessfullCounts: number;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
    field: 'activeFailedCounts',
  })
  activeFailedCounts: number;

  @ForeignKey(() => UsersModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  ownerId: string;
}
