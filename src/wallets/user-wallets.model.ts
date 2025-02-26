import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { WalletsModel } from '../wallets/wallets.model';
import { UsersModel } from '../users/users.model';

@Table({ tableName: 'user_wallets', createdAt: false, updatedAt: false })
export class UserWallets extends Model<UserWallets> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    unique: true,
    allowNull: false,
  })
  id: number;

  @ForeignKey(() => WalletsModel)
  @Column({ type: DataType.STRING })
  steamId: string;

  @ForeignKey(() => UsersModel)
  @Column({ type: DataType.UUID })
  ownerId: string;
}
