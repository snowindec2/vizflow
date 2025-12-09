import React, { useState, useEffect } from 'react';
import { LayoutDashboard, KanbanSquare, Plus, FileText, Settings, Bot } from 'lucide-react';
import { Task, TaskStatus, Priority } from './types';
import { TaskBoard } from './components/TaskBoard';
import { TaskModal } from './components/TaskModal';
import { StatsCharts } from './components/StatsCharts';
import { CompletionRing } from './components/CompletionRing';
import { generateWeeklyReport } from './services/geminiService';

// Mock Data for Initial State
const initialMockTasks: Task[] = [
  {
    id: '1',
    title: 'Implement Authentication',
    description: 'Setup JWT auth and secure routes',
    status: TaskStatus.IN_PROGRESS,
    priority: Priority.HIGH,
    createdAt: new Date().toISOString(),
    tags: ['backend', 'security'],
    subtasks: [
      { id: '1a', title: 'Setup User Model', isCompleted: true },
      { id: '1b', title: 'Login Endpoint', isCompleted: false }
    ]
  },
  {
    id: '2',
    title: 'Design Dashboard UI',
    description: 'Create responsive layout for the main dashboard',
    status: TaskStatus.DONE,
    priority: Priority.MEDIUM,
    createdAt: new Date().toISOString(),
    tags: ['frontend', 'design'],
    subtasks: [
      { id: '2a', title: 'Wireframes', isCompleted: true },
      { id: '2b', title: 'Component Library', isCompleted: true }
    ]
  },
  {
    id: '3',
    title: 'Database Optimization',
    description: 'Analyze query performance',
    status: TaskStatus.TODO,
    priority: Priority.LOW,
    createdAt: new Date().toISOString(),
    tags: ['db', 'perf'],
    subtasks: []
  }
];

function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'board'>('dashboard');
  const [tasks, setTasks] = useState<Task[]>(initialMockTasks);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  // Computed Stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === TaskStatus.DONE).length;
  const completionPercentage = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;

  const handleCreateTask = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleSaveTask = (task: Task) => {
    if (editingTask) {
      setTasks(tasks.map(t => t.id === task.id ? task : t));
    } else {
      setTasks([...tasks, task]);
    }
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(t => t.id !== taskId));
  };

  const handleMoveTask = (taskId: string, newStatus: TaskStatus) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
  };

  const handleGenerateReport = async () => {
    setIsGeneratingReport(true);
    const report = await generateWeeklyReport(tasks);
    setAiReport(report);
    setIsGeneratingReport(false);
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col hidden md:flex">
        <div className="p-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-2">
            <Bot className="text-indigo-400" /> VizFlow AI
          </h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'dashboard' ? 'bg-indigo-600/10 text-indigo-400' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <LayoutDashboard size={20} />
            <span className="font-medium">Dashboard</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('board')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'board' ? 'bg-indigo-600/10 text-indigo-400' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <KanbanSquare size={20} />
            <span className="font-medium">Task Board</span>
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
           <div className="bg-slate-800 rounded-xl p-4 flex flex-col items-center">
             <span className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-2">Completion Rate</span>
             <CompletionRing percentage={completionPercentage} />
           </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Mobile Header */}
        <header className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900/50 backdrop-blur-sm z-10">
          <div className="md:hidden font-bold text-lg text-indigo-400">VizFlow AI</div>
          <div className="flex items-center gap-4 ml-auto">
             <button 
               onClick={handleCreateTask}
               className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-lg shadow-indigo-500/20"
             >
               <Plus size={18} />
               <span className="hidden sm:inline">New Task</span>
             </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
          <div className="max-w-7xl mx-auto">
            
            {activeTab === 'dashboard' && (
              <div className="animate-fade-in space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2">Project Overview</h2>
                    <p className="text-slate-400">Track progress, analyze workload, and automate reports.</p>
                  </div>
                  <button 
                    onClick={handleGenerateReport}
                    disabled={isGeneratingReport}
                    className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-4 py-2 rounded-lg transition-all"
                  >
                    {isGeneratingReport ? <span className="animate-spin">✨</span> : <FileText size={18} />}
                    {isGeneratingReport ? 'Analyzing...' : 'Generate AI Report'}
                  </button>
                </div>

                {/* AI Report Section */}
                {aiReport && (
                   <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-500/30 rounded-xl p-6 mb-8">
                     <div className="flex items-center gap-2 mb-3 text-indigo-300">
                       <SparklesIcon />
                       <h3 className="font-semibold">AI Weekly Summary</h3>
                     </div>
                     <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                       {aiReport}
                     </div>
                   </div>
                )}

                {/* Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                   <MetricCard label="Total Tasks" value={totalTasks} color="bg-blue-500/10 text-blue-400" />
                   <MetricCard label="In Progress" value={tasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length} color="bg-orange-500/10 text-orange-400" />
                   <MetricCard label="Completed" value={completedTasks} color="bg-emerald-500/10 text-emerald-400" />
                   <MetricCard label="High Priority" value={tasks.filter(t => t.priority === Priority.HIGH || t.priority === Priority.CRITICAL).length} color="bg-red-500/10 text-red-400" />
                </div>

                <StatsCharts tasks={tasks} />
              </div>
            )}

            {activeTab === 'board' && (
              <div className="h-full flex flex-col">
                 <div className="mb-6 flex items-center justify-between">
                   <h2 className="text-2xl font-bold text-white">Kanban Board</h2>
                 </div>
                 <div className="flex-1">
                   <TaskBoard 
                     tasks={tasks} 
                     onMoveTask={handleMoveTask}
                     onEditTask={handleEditTask}
                     onDeleteTask={handleDeleteTask}
                   />
                 </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <TaskModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        initialTask={editingTask}
      />
    </div>
  );
}

// Simple internal components for layout cleanliness
const MetricCard = ({ label, value, color }: { label: string, value: number, color: string }) => (
  <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
    <p className="text-slate-400 text-sm font-medium mb-1">{label}</p>
    <div className={`text-2xl font-bold px-2 py-1 rounded inline-block ${color}`}>
      {value}
    </div>
  </div>
);

const SparklesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
  </svg>
);

export default App;
