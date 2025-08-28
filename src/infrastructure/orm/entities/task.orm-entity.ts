import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { UserOrm } from './user.orm-entity';

@Entity('tasks')
export class TaskOrm {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  dueDate: Date;

  @Column({ default: 'pending' })
  status: string;

  @ManyToOne(() => UserOrm, (u) => u.tasks, { onDelete: 'CASCADE' })
  user: UserOrm;
}
