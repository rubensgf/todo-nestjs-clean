import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { TaskOrm } from './task.orm-entity';

@Entity('users')
export class UserOrm {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @OneToMany(() => TaskOrm, (t) => t.user)
  tasks: TaskOrm[];
}
