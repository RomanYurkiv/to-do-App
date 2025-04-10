import { Table, Column, Model, DataType, BelongsToMany } from 'sequelize-typescript';
import bcrypt from 'bcrypt';
import { TodoList } from './TodoList';
import { ListUser } from './ListUser';

interface UserCreationAttrs {
  name: string;
  email: string;
  password: string;
}

@Table({
  tableName: 'users',
  timestamps: true,
})
export class User extends Model<User, UserCreationAttrs> {
  @Column({ type: DataType.STRING, allowNull: false })
  name!: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  email!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  password!: string;

  @BelongsToMany(() => TodoList, () => ListUser)
  todoLists!: TodoList[];

  async validatePassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }
}
  