import React from 'react';
import { BoardData, Status, User } from '../../types';
import { STATUS_COLORS } from '../../constants';

interface DashboardViewProps {
  boardData: BoardData;
  allUsers: User[];
}

const DashboardView: React.FC<DashboardViewProps> = ({ boardData, allUsers }) => {
  const allTasks = boardData.groups.flatMap(g => g.tasks);
  const totalTasks = allTasks.length;
  const completedTasks = allTasks.filter(t => t.properties['col-status'] === Status.Done).length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const tasksByStatus = allTasks.reduce((acc, task) => {
    const status = task.properties['col-status'] as Status;
    if (status) {
      acc[status] = (acc[status] || 0) + 1;
    }
    return acc;
  }, {} as Record<Status, number>);

  const tasksByAssignee = allTasks.reduce((acc, task) => {
      const assignee = task.properties['col-assignee'] as User;
      if (assignee && assignee.id) {
          acc[assignee.id] = (acc[assignee.id] || 0) + 1;
      }
      return acc;
  }, {} as Record<string, number>);

  const maxTasksByStatus = Math.max(...Object.values(tasksByStatus), 1);
  const maxTasksByAssignee = Math.max(...Object.values(tasksByAssignee), 1);

  const StatCard: React.FC<{ title: string; value: string | number; description: string }> = ({ title, value, description }) => (
    <div className="bg-[--card-bg] p-6 rounded-lg border border-[--border-color]">
      <h3 className="text-sm font-medium text-[--secondary-text] uppercase">{title}</h3>
      <p className="text-3xl font-bold mt-2">{value}</p>
      <p className="text-sm text-[--secondary-text] mt-1">{description}</p>
    </div>
  );

  return (
    <main className="flex-1 p-8 bg-[--board-bg] custom-scrollbar overflow-y-auto">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Tasks" value={totalTasks} description="All tasks across all groups" />
        <StatCard title="Completed Tasks" value={completedTasks} description="Tasks marked as 'Completado'" />
        <StatCard title="Completion Rate" value={`${completionPercentage}%`} description="Percentage of completed tasks" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[--card-bg] p-6 rounded-lg border border-[--border-color]">
          <h2 className="text-lg font-semibold mb-4">Tasks by Status</h2>
          <div className="space-y-4">
            {Object.entries(tasksByStatus).map(([status, count]) => (
              <div key={status}>
                <div className="flex justify-between items-center text-sm mb-1">
                  <span className="font-medium">{status}</span>
                  <span className="text-[--secondary-text]">{count}</span>
                </div>
                <div className="w-full bg-[--input-bg] rounded-full h-2.5">
                  <div 
                    className={`${STATUS_COLORS[status as Status]} h-2.5 rounded-full`} 
                    style={{ width: `${(count / maxTasksByStatus) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[--card-bg] p-6 rounded-lg border border-[--border-color]">
          <h2 className="text-lg font-semibold mb-4">Tasks per User</h2>
          <div className="space-y-4">
            {Object.entries(tasksByAssignee).map(([userId, count]) => {
              const user = allUsers.find(u => u.id === userId);
              if (!user) return null;
              return (
                <div key={userId}>
                  <div className="flex justify-between items-center text-sm mb-1">
                    <div className="flex items-center gap-2">
                        <img src={user.avatarUrl} alt={user.name} className="w-5 h-5 rounded-full" />
                        <span className="font-medium">{user.name}</span>
                    </div>
                    <span className="text-[--secondary-text]">{count} tasks</span>
                  </div>
                  <div className="w-full bg-[--input-bg] rounded-full h-2.5">
                    <div 
                      className="bg-[--accent-color] h-2.5 rounded-full"
                      style={{ width: `${(count / maxTasksByAssignee) * 100}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
};

export default DashboardView;