import { Status, Priority, BoardData, User, Column, DropdownOption } from './types';

export const STATUS_COLORS: Record<Status, string> = {
  [Status.Todo]: 'bg-gray-400',
  [Status.InProgress]: 'bg-blue-500',
  [Status.Done]: 'bg-green-500',
  [Status.Blocked]: 'bg-red-500',
};

export const PRIORITY_COLORS: Record<Priority, string> = {
  [Priority.Urgent]: 'bg-red-600',
  [Priority.High]: 'bg-orange-500',
  [Priority.Medium]: 'bg-yellow-400',
  [Priority.Low]: 'bg-blue-400',
};

export const MOCK_USERS: User[] = [
  { id: 'user-1', name: 'Alex Johnson', email: 'alex@example.com', password: 'password123', avatarUrl: `https://i.pravatar.cc/150?u=user-1` },
  { id: 'user-2', name: 'Maria Garcia', email: 'maria@example.com', password: 'password123', avatarUrl: `https://i.pravatar.cc/150?u=user-2` },
  { id: 'user-3', name: 'James Smith', email: 'james@example.com', password: 'password123', avatarUrl: `https://i.pravatar.cc/150?u=user-3` },
  { id: 'user-4', name: 'Li Wang', email: 'li@example.com', password: 'password123', avatarUrl: `https://i.pravatar.cc/150?u=user-4` },
];

const DROPDOWN_OPTIONS: DropdownOption[] = [
    { id: 'opt-1', label: 'Feature', color: 'bg-purple-500' },
    { id: 'opt-2', label: 'Bug', color: 'bg-red-500' },
    { id: 'opt-3', label: 'Documentation', color: 'bg-blue-500' },
];

export const MOCK_COLUMNS: Column[] = [
    { id: 'col-assignee', title: 'Assignee', type: 'assignee' },
    { id: 'col-status', title: 'Status', type: 'status' },
    { id: 'col-priority', title: 'Priority', type: 'priority' },
    { id: 'col-due', title: 'Due Date', type: 'date' },
    { id: 'col-progress', title: 'Progress', type: 'progress' },
    { id: 'col-approved', title: 'Approved', type: 'checkbox' },
    { id: 'col-type', title: 'Type', type: 'dropdown', options: DROPDOWN_OPTIONS },
];

export const MOCK_BOARD_DATA: BoardData = {
  id: 'board-1',
  name: 'Manejo de Proyectos y Tareas',
  columns: MOCK_COLUMNS,
  groups: [
    {
      id: 'group-1',
      title: 'Mobile App',
      tasks: [
        { id: 'task-1', title: 'Design login flow', properties: { 
            'col-assignee': MOCK_USERS[0], 
            'col-status': Status.Done, 
            'col-priority': Priority.High, 
            'col-due': '2024-08-15',
            'col-progress': 100,
            'col-approved': true,
            'col-type': DROPDOWN_OPTIONS[0],
         },
         subtasks: [
            { id: 'sub-1-1', title: 'Wireframe initial screens', completed: true },
            { id: 'sub-1-2', title: 'Create component library', completed: true },
         ]
        },
        { id: 'task-2', title: 'Implement user authentication', properties: { 
            'col-assignee': MOCK_USERS[1], 
            'col-status': Status.InProgress, 
            'col-priority': Priority.Urgent, 
            'col-due': '2024-08-20',
            'col-progress': 50,
            'col-approved': false,
            'col-type': DROPDOWN_OPTIONS[0],
        } },
      ],
    },
    {
      id: 'group-2',
      title: 'Web Platform',
      tasks: [
        { id: 'task-3', title: 'Develop landing page', properties: { 
            'col-assignee': MOCK_USERS[2], 
            'col-status': Status.Todo, 
            'col-priority': Priority.Medium, 
            'col-due': '2024-08-25',
            'col-progress': 10,
            'col-approved': false,
            'col-type': DROPDOWN_OPTIONS[2],
        } },
         { id: 'task-4', title: 'Fix API rate limiting bug', properties: { 
            'col-assignee': MOCK_USERS[3], 
            'col-status': Status.Blocked, 
            'col-priority': Priority.High, 
            'col-due': '2024-09-01',
            'col-progress': 90,
            'col-approved': true,
            'col-type': DROPDOWN_OPTIONS[1],
        } },
      ],
    },
  ],
};