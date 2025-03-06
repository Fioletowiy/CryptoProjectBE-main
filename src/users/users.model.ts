import { Model, Table, Column, DataType, HasMany } from 'sequelize-typescript';
import { UsersAttrs } from './types/users.interface.type';
import { WalletsModel } from 'src/wallets/models/wallets.model';
import { ProxyModel } from 'src/proxy/proxy.model';

@Table({ tableName: 'users' })
export class UsersModel extends Model<UsersModel, UsersAttrs> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    unique: true,
    allowNull: false,
  })
  userId: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  firstName: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  lastName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  email: string;

  @Column({
    type: DataType.STRING,
  })
  picture: string;

  @Column({
    type: DataType.STRING,
  })
  accessToken: string;

  @Column({
    type: DataType.STRING,
  })
  refreshToken: string;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
  })
  userRole: Array<string>;

  @Column({
    type: DataType.DATE,
  })
  updatedAt: Date;

  @Column({
    type: DataType.UUID,
  })
  masterProxyUUID: string;

  @HasMany(() => WalletsModel, { foreignKey: 'ownerId' })
  wallets: WalletsModel[];

  @HasMany(() => ProxyModel, { foreignKey: 'ownerId' })
  proxies: ProxyModel[];
}
