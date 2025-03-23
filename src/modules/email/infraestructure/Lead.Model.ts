import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'leads',
  timestamps: true,
})
export class LeadModel extends Model {
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
  status!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  accountId!: number;
}
