export enum TaskStatusEnum {
  PENDING = 'pending',
  DONE = 'done',
}

export class Task {
  constructor(
    public readonly id: string,
    public title: string,
    public description: string | null,
    public createdAt: Date,
    public dueDate: Date | null,
    public status: TaskStatusEnum,
    public ownerId: string,
  ) {}
}
