import { Table, Column, Model, DataType, ForeignKey, BelongsTo, BelongsToMany, HasMany } from 'sequelize-typescript';
import { User } from './User';
import { ListUser } from './ListUser';
import { Task } from './Task';


@Table({
  tableName: 'todo_lists',
  timestamps: true,
})
export class TodoList extends Model {
  @Column({ type: DataType.STRING, allowNull: false })
  title!: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  ownerId!: number;

  @BelongsTo(() => User)
  owner!: User;

  @BelongsToMany(() => User, () => ListUser)
  users!: User[];

  @HasMany(() => Task) 
  tasks?: Task[];
}