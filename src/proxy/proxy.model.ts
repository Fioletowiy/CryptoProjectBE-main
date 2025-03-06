import {
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { UsersModel } from 'src/users/users.model';
import { WalletsModel } from '../wallets/models/wallets.model';

@Table({ tableName: 'proxy', createdAt: true, updatedAt: true })
export class ProxyModel extends Model<ProxyModel> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    allowNull: false,
  })
  ProxyUUID: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  ProxyId: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  ProxyName: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  ProxyComment: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  ProxyIP: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  ProxyPort: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  ProxyUserName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  ProxyPassword: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  ProxyProtocol: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  ProxyStatus: string;

  @ForeignKey(() => UsersModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  ownerId: string;

  @HasMany(() => WalletsModel, { foreignKey: 'proxyUUID' })
  wallets: WalletsModel[];
}
