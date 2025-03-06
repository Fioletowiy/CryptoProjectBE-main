import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { WalletsModel } from './wallets.model';

@Table({ tableName: 'wallet_Addresses', createdAt: false, updatedAt: false })
export class WalletAddressesModel extends Model<WalletAddressesModel> {
  @ForeignKey(() => WalletsModel)
  @Column({ type: DataType.UUID, primaryKey: true, allowNull: false })
  walletUUID: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  BNB: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  TRX: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  ETHevm: string;

  @BelongsTo(() => WalletsModel)
  wallet: WalletsModel;
}
