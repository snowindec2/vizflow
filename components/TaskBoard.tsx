import React from 'react';
import { Task, TaskStatus, Priority } from '../types';
import { MoreVertical, Calendar, CheckCircle2, Circle } from 'lucide-react';

interface TaskBoardProps {
  tasks: Task[];
  onMoveTask: (taskId: string, newStatus: TaskStatus) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

const statusColumns = [
  { id: TaskStatus.TODO, label: 'To Do', color: 'bg-slate-500' },
  { id: TaskStatus.IN_PROGRESS, label: 'In Progress', color: 'bg-blue-500' },
  { id: TaskStatus.REVIEW, label: 'Review', color: 'bg-purple-500' },
  { id: TaskStatus.DONE, label: 'Done', color: 'bg-emerald-500' },
];

const priorityColors: Record<Priority, string> = {
  [Priority.LOW]: 'text-slate-400 bg-slate-400/10',
  [Priority.MEDIUM]: 'text-blue-400 bg-blue-400/10',
  [Priority.HIGH]: 'text-orange-400 bg-orange-400/10',
  [Priority.CRITICAL]: 'text-red-400 bg-red-400/10',
};

export const TaskBoard: React.FC<TaskBoardProps> = ({ tasks, onMoveTask, onEditTask, onDeleteTask }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 overflow-x-auto pb-4">
      {statusColumns.map((column) => {
        const columnTasks = tasks.filter(t => t.status === column.id);

        return (
          <div key={column.id} className="min-w-[280px] flex flex-col h-full">
            <div className="flex items-center justify-between mb-4 px-2">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${column.color}`} />
                <h3 className="font-semibold text-slate-200">{column.label}</h3>
                <span className="bg-slate-800 text-slate-400 text-xs px-2 py-0.5 rounded-full">
                  {columnTasks.length}
                </span>
              </div>
            </div>

            <div className="flex-1 bg-slate-900/50 rounded-xl p-2 border border-slate-800/50 space-y-3 min-h-[200px]">
              {columnTasks.map((task) => (
                <div 
                  key={task.id}
                  className="bg-slate-800 p-4 rounded-lg border border-slate-700 hover:border-indigo-500/50 transition-all group relative shadow-sm"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${priorityColors[task.priority]}`}>
                      {task.priority}
                    </span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => onEditTask(task)}
                        className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white"
                      >
                        <MoreVertical size={14} />
                      </button>
                    </div>
                  </div>

                  <h4 className="text-slate-200 font-medium mb-1">{task.title}</h4>
                  <p className="text-slate-400 text-sm line-clamp-2 mb-3">{task.description}</p>

                  {task.subtasks.length > 0 && (
                     <div className="mb-3">
                       <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                         <div 
                            className="bg-indigo-500 h-full" 
                            style={{ width: `${(task.subtasks.filter(s => s.isCompleted).length / task.subtasks.length) * 100}%`}}
                         />
                       </div>
                       <p className="text-xs text-slate-500 mt-1 text-right">
                         {task.subtasks.filter(s => s.isCompleted).length}/{task.subtasks.length} subtasks
                       </p>
                     </div>
                  )}

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-700/50">
                    <div className="flex gap-2 flex-wrap">
                      {task.tags.map(tag => (
                        <span key={tag} className="text-xs text-slate-500">#{tag}</span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Quick Actions for Kanban Movement (Simplification for no DND lib) */}
                  <div className="flex justify-between items-center mt-3 gap-2">
                     {column.id !== TaskStatus.TODO && (
                       <button 
                         onClick={() => onMoveTask(task.id, getPrevStatus(column.id))}
                         className="text-xs text-slate-500 hover:text-slate-300"
                       >
                         &larr; Prev
                       </button>
                     )}
                     <div className="flex-1"></div>
                     {column.id !== TaskStatus.DONE && (
                       <button 
                          onClick={() => onMoveTask(task.id, getNextStatus(column.id))}
                          className="text-xs text-indigo-400 hover:text-indigo-300"
                       >
                         Next &rarr;
                       </button>
                     )}
                  </div>

                </div>
              ))}
              {columnTasks.length === 0 && (
                 <div className="h-full flex items-center justify-center text-slate-600 text-sm italic">
                   No tasks
                 </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Helpers for simple state transitions
const getNextStatus = (current: TaskStatus): TaskStatus => {
  if (current === TaskStatus.TODO) return TaskStatus.IN_PROGRESS;
  if (current === TaskStatus.IN_PROGRESS) return TaskStatus.REVIEW;
  return TaskStatus.DONE;
};

const getPrevStatus = (current: TaskStatus): TaskStatus => {
  if (current === TaskStatus.DONE) return TaskStatus.REVIEW;
  if (current === TaskStatus.REVIEW) return TaskStatus.IN_PROGRESS;
  return TaskStatus.TODO;
};
