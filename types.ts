export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  REVIEW = 'REVIEW',
  DONE = 'DONE'
}

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  createdAt: string; // ISO String
  dueDate?: string;
  tags: string[];
  subtasks: SubTask[];
}

export interface SubTask {
  id: string;
  title: string;
  isCompleted: boolean;
}

export interface AIGeneratedSubtasks {
  subtasks: string[];
  suggestedPriority: Priority;
  suggestedTags: string[];
}
