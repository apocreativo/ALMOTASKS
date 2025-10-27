

export enum Status {
  Todo = 'Sin empezar',
  InProgress = 'En progreso',
  Done = 'Completado',
  Blocked = 'Bloqueado',
}

export enum Priority {
  Urgent = 'Urgent',
  High = 'High',
  Medium = 'Medium',
  Low = 'Low',
}

export interface User {
  id: string;
  name: string;
  avatarUrl: string;
  email: string;
  password: string;
}

export type ColumnType = 'text' | 'assignee' | 'status' | 'priority' | 'date' | 'checkbox' | 'progress' | 'dropdown';

export interface DropdownOption {
  id: string;
  label: string;
  color: string;
}

export interface Column {
  id: string;
  title: string;
  type: ColumnType;
  options?: DropdownOption[]; // for dropdown type
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id:string;
  title: string;
  properties: {
    [columnId: string]: any;
  };
  subtasks?: Subtask[];
  description?: string;
}

export interface Group {
  id: string;
  title: string;
  tasks: Task[];
}

export interface BoardData {
  id: string;
  name: string;
  columns: Column[];
  groups: Group[];
}