import React from 'react';
import { 
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend 
} from 'recharts';
import { Task, TaskStatus, Priority } from '../types';

interface StatsChartsProps {
  tasks: Task[];
}

const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#10b981']; // Indigo, Purple, Pink, Emerald

export const StatsCharts: React.FC<StatsChartsProps> = ({ tasks }) => {
  
  // Prepare Data for Pie Chart (Status)
  const statusData = [
    { name: 'To Do', value: tasks.filter(t => t.status === TaskStatus.TODO).length },
    { name: 'In Progress', value: tasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length },
    { name: 'Review', value: tasks.filter(t => t.status === TaskStatus.REVIEW).length },
    { name: 'Done', value: tasks.filter(t => t.status === TaskStatus.DONE).length },
  ].filter(d => d.value > 0);

  // Prepare Data for Bar Chart (Priority)
  const priorityData = [
    { name: 'Low', count: tasks.filter(t => t.priority === Priority.LOW).length },
    { name: 'Medium', count: tasks.filter(t => t.priority === Priority.MEDIUM).length },
    { name: 'High', count: tasks.filter(t => t.priority === Priority.HIGH).length },
    { name: 'Critical', count: tasks.filter(t => t.priority === Priority.CRITICAL).length },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Status Distribution */}
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-100 mb-4">Task Status Distribution</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                itemStyle={{ color: '#f8fafc' }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Priority Breakdown */}
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-100 mb-4">Workload by Priority</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={priorityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" allowDecimals={false} />
              <Tooltip 
                cursor={{fill: '#334155', opacity: 0.4}}
                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
              />
              <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
