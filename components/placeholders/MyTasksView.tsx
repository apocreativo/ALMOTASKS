import React from 'react';
import { BoardData, Task, User, Column } from '../../types';
import TaskRow from '../TaskRow';

interface MyTasksViewProps {
  boardData: BoardData;
  currentUser: User;
  allUsers: User[];
  onUpdateTask: (task: Task) => void;
  onSelectTask: (task: Task) => void;
  onColumnUpdate: (column: Column) => void;
}

const MyTasksView: React.FC<MyTasksViewProps> = ({ boardData, currentUser, allUsers, onUpdateTask, onSelectTask, onColumnUpdate }) => {

  const assigneeColumnId = boardData.columns.find(c => c.type === 'assignee')?.id;

  const myTasks = boardData.groups.flatMap(group => 
    group.tasks
      .filter(task => assigneeColumnId && task.properties[assigneeColumnId]?.id === currentUser.id)
      .map(task => ({ ...task, groupTitle: group.title }))
  );

  return (
    <main className="flex-1 p-8 bg-[--board-bg] custom-scrollbar overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">My Tasks</h1>
        {myTasks.length > 0 ? (
            <div className="bg-[--card-bg] rounded-lg border border-[--border-color] overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-[--border-color] text-xs text-left text-[--secondary-text] uppercase">
                            <th className="font-medium p-3 w-2/5">Task</th>
                            {boardData.columns.map(col => (
                                <th key={col.id} className="font-medium p-3 w-[160px]">{col.title}</th>
                            ))}
                            <th className="font-medium p-3 w-[120px]">Group</th>
                            <th className="font-medium p-1 w-[60px]"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {myTasks.map(task => (
                            <TaskRow
                                key={task.id}
                                task={task}
                                columns={boardData.columns}
                                allUsers={allUsers}
                                onUpdate={onUpdateTask}
                                onSelect={() => onSelectTask(task)}
                                onColumnUpdate={onColumnUpdate}
                            >
                                <td className="p-3 w-[120px] text-sm text-[--secondary-text]">{task.groupTitle}</td>
                            </TaskRow>
                        ))}
                    </tbody>
                </table>
            </div>
        ) : (
            <div className="text-center py-16">
                <h2 className="text-2xl font-semibold">All clear!</h2>
                <p className="mt-2 text-lg text-[--secondary-text]">
                You have no tasks assigned to you.
                </p>
            </div>
        )}
      </div>
    </main>
  );
};

export default MyTasksView;