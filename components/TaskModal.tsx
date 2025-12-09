import React, { useState, useEffect } from 'react';
import { Task, TaskStatus, Priority, SubTask } from '../types';
import { X, Sparkles, Plus, Trash2, CheckSquare, Square } from 'lucide-react';
import { analyzeTaskWithAI } from '../services/geminiService';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
  initialTask?: Task | null;
}

export const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onSave, initialTask }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>(Priority.MEDIUM);
  const [status, setStatus] = useState<TaskStatus>(TaskStatus.TODO);
  const [tags, setTags] = useState<string>('');
  const [subtasks, setSubtasks] = useState<SubTask[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setDescription(initialTask.description);
      setPriority(initialTask.priority);
      setStatus(initialTask.status);
      setTags(initialTask.tags.join(', '));
      setSubtasks(initialTask.subtasks);
    } else {
      // Reset
      setTitle('');
      setDescription('');
      setPriority(Priority.MEDIUM);
      setStatus(TaskStatus.TODO);
      setTags('');
      setSubtasks([]);
    }
  }, [initialTask, isOpen]);

  const handleAIAnalysis = async () => {
    if (!title) return;
    setIsAnalyzing(true);
    const result = await analyzeTaskWithAI(title, description);
    
    // Merge results carefully
    setPriority(result.priority);
    
    // Add new subtasks to existing ones
    const newSubtasks: SubTask[] = result.subtasks.map(t => ({
      id: Math.random().toString(36).substr(2, 9),
      title: t,
      isCompleted: false
    }));
    setSubtasks([...subtasks, ...newSubtasks]);

    // Append tags
    const currentTags = tags.split(',').map(t => t.trim()).filter(Boolean);
    const uniqueTags = Array.from(new Set([...currentTags, ...result.tags]));
    setTags(uniqueTags.join(', '));

    setIsAnalyzing(false);
  };

  const handleSave = () => {
    const newTask: Task = {
      id: initialTask?.id || Math.random().toString(36).substr(2, 9),
      title,
      description,
      status,
      priority,
      createdAt: initialTask?.createdAt || new Date().toISOString(),
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      subtasks,
    };
    onSave(newTask);
    onClose();
  };

  const toggleSubtask = (id: string) => {
    setSubtasks(subtasks.map(s => s.id === id ? { ...s, isCompleted: !s.isCompleted } : s));
  };

  const deleteSubtask = (id: string) => {
    setSubtasks(subtasks.filter(s => s.id !== id));
  };

  const addSubtask = () => {
    setSubtasks([...subtasks, { id: Math.random().toString(36).substr(2, 9), title: 'New Subtask', isCompleted: false }]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 w-full max-w-2xl rounded-2xl border border-slate-800 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <h2 className="text-xl font-semibold text-white">
            {initialTask ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">Title</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Redesign Landing Page"
                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <button 
                onClick={handleAIAnalysis}
                disabled={isAnalyzing || !title}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                {isAnalyzing ? (
                  <span className="animate-spin">✨</span>
                ) : (
                  <Sparkles size={18} />
                )}
                <span className="hidden sm:inline">AI Assist</span>
              </button>
            </div>
            <p className="text-xs text-slate-500">
              Tip: Enter a title and click AI Assist to auto-generate subtasks and priority.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Priority</label>
              <select 
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                {Object.values(Priority).map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Status</label>
              <select 
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                {Object.values(TaskStatus).map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">Description</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">Tags (comma separated)</label>
            <input 
              type="text" 
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="design, frontend, ui"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div className="space-y-3">
             <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-400">Subtasks</label>
                <button 
                  onClick={addSubtask}
                  className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                >
                  <Plus size={14} /> Add Manual
                </button>
             </div>
             <div className="space-y-2 bg-slate-950/30 p-4 rounded-lg border border-slate-800">
               {subtasks.length === 0 && (
                 <p className="text-slate-600 text-sm text-center italic">No subtasks defined yet.</p>
               )}
               {subtasks.map((st) => (
                 <div key={st.id} className="flex items-center gap-3 group">
                   <button onClick={() => toggleSubtask(st.id)} className="text-slate-400 hover:text-white">
                     {st.isCompleted ? <CheckSquare size={18} className="text-emerald-500" /> : <Square size={18} />}
                   </button>
                   <input 
                      type="text" 
                      value={st.title}
                      onChange={(e) => {
                        const newTitle = e.target.value;
                        setSubtasks(subtasks.map(s => s.id === st.id ? { ...s, title: newTitle } : s));
                      }}
                      className={`flex-1 bg-transparent outline-none text-sm ${st.isCompleted ? 'text-slate-500 line-through' : 'text-slate-200'}`}
                   />
                   <button onClick={() => deleteSubtask(st.id)} className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-opacity">
                     <Trash2 size={16} />
                   </button>
                 </div>
               ))}
             </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-800 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors"
          >
            Save Task
          </button>
        </div>
      </div>
    </div>
  );
};
