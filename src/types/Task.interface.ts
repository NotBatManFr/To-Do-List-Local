import { Priority } from './Priority.enum';

export interface Task {
  task: string;
  dueDate: string;
  priority: Priority;
}