import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'accounts',
  timestamps: false,
})
export class AccountModel extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  email!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  sentCount!: number;
  
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  blockedUntil?: Date;
}
