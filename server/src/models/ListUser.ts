import { Table, Column, Model, ForeignKey, DataType } from 'sequelize-typescript';
import { User } from './User';
import { TodoList } from './TodoList';

@Table({
  tableName: 'list_users',
  timestamps: false,
})
export class ListUser extends Model {
  @ForeignKey(() => User)
  @Column
  userId!: number;

  @ForeignKey(() => TodoList)
  @Column
  todoListId!: number;

  @Column({ type: DataType.ENUM('Admin', 'Viewer'), allowNull: false })
  role!: 'Admin' | 'Viewer';
}