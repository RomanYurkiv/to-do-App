import { Table, Column, Model, DataType, ForeignKey } from 'sequelize-typescript';
import { TodoList } from './TodoList';

@Table({
  tableName: 'tasks',
  timestamps: true,
})
export class Task extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title!: string;

  @Column({
    type: DataType.STRING,
  })
  description!: string;

  @ForeignKey(() => TodoList)
  @Column
  todoListId!: number;


  @Column({
    type: DataType.ENUM('completed', 'pending'),
    allowNull: false,
  })
  status!: 'completed' | 'pending';
;
}