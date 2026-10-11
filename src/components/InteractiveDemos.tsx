import React, { useState, useEffect } from 'react';
import { Check, Plus, Trash2, Edit2, RotateCcw, Save } from 'lucide-react';

interface DemoTask {
  id: string;
  title: string;
  completed: boolean;
  priority: 'Normal' | 'High';
}

const DEFAULT_DEMO_TASKS: DemoTask[] = [
  { id: 't-1', title: 'Finalize responsive hero layout for client review', completed: true, priority: 'High' },
  { id: 't-2', title: 'Optimize property gallery images for mobile speed', completed: false, priority: 'High' },
  { id: 't-3', title: 'Connect WhatsApp direct inquiry link in footer', completed: false, priority: 'Normal' },
];

export const InteractiveTaskManagerDemo: React.FC = () => {
  const [tasks, setTasks] = useState<DemoTask[]>(() => {
    try {
      const saved = localStorage.getItem('weblume_demo_tasks_v1');
      return saved ? JSON.parse(saved) : DEFAULT_DEMO_TASKS;
    } catch {
      return DEFAULT_DEMO_TASKS;
    }
  });
  const [newTitle, setNewTitle] = useState('');
  const [priority, setPriority] = useState<'Normal' | 'High'>('Normal');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem('weblume_demo_tasks_v1', JSON.stringify(tasks));
    } catch {
      // Ignore storage quota errors
    }
  }, [tasks]);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const item: DemoTask = {
      id: `task-${Date.now()}`,
      title: newTitle.trim(),
      completed: false,
      priority,
    };
    setTasks([item, ...tasks]);
    setNewTitle('');
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const startEditing = (task: DemoTask) => {
    setEditingId(task.id);
    setEditingText(task.title);
  };

  const saveEdit = (id: string) => {
    if (!editingText.trim()) return;
    setTasks(tasks.map((t) => (t.id === id ? { ...t, title: editingText.trim() } : t)));
    setEditingId(null);
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const activeCount = tasks.filter((t) => !t.completed).length;

  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#0D0D12] p-5">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <span className="text-xs text-violet-600 dark:text-violet-400 font-medium">
            Interactive Live Sandbox · LocalStorage Enabled
          </span>
          <h4 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mt-0.5">
            Task Manager Web Application
          </h4>
        </div>
        <div className="flex items-center gap-1 bg-zinc-200/70 dark:bg-zinc-900 p-1 rounded-lg">
          {(['all', 'active', 'completed'] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md capitalize transition-colors whitespace-nowrap shrink-0 ${
                filter === f
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleAddTask} className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Add a new task to test LocalStorage persistence..."
          className="flex-1 px-3.5 py-2 text-sm rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-violet-500"
        />
        <div className="flex items-center gap-2">
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as 'Normal' | 'High')}
            aria-label="Task priority"
            className="px-3 py-2 text-xs font-medium rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-violet-500"
          >
            <option value="Normal">Normal Priority</option>
            <option value="High">High Priority</option>
          </select>
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-500 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Task
          </button>
        </div>
      </form>

      <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
        {filteredTasks.length === 0 ? (
          <p className="text-xs text-zinc-500 py-6 text-center">
            No tasks in this view. Add a task above or switch filters.
          </p>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800/90 bg-white dark:bg-zinc-900/70"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <button
                  type="button"
                  onClick={() => toggleTask(task.id)}
                  aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
                  className={`w-5 h-5 rounded flex items-center justify-center border transition-colors shrink-0 cursor-pointer ${
                    task.completed
                      ? 'bg-violet-600 border-violet-600 text-white'
                      : 'border-zinc-400 dark:border-zinc-600 hover:border-violet-500'
                  }`}
                >
                  {task.completed && <Check className="w-3 h-3" />}
                </button>

                {editingId === task.id ? (
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="text"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      className="flex-1 px-2 py-1 text-xs rounded border border-violet-500 bg-transparent text-zinc-900 dark:text-zinc-100"
                    />
                    <button
                      type="button"
                      onClick={() => saveEdit(task.id)}
                      className="p-1 text-violet-600 dark:text-violet-400 hover:opacity-80"
                      title="Save task"
                    >
                      <Save className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-sm truncate ${
                        task.completed
                          ? 'line-through text-zinc-400 dark:text-zinc-500'
                          : 'text-zinc-800 dark:text-zinc-200'
                      }`}
                    >
                      {task.title}
                    </p>
                    <span className="text-[11px] text-zinc-500">
                      Priority: {task.priority} · {task.completed ? 'Completed' : 'Active'}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => startEditing(task)}
                  className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors cursor-pointer"
                  aria-label="Edit task"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => deleteTask(task.id)}
                  className="p-1.5 text-zinc-400 hover:text-rose-500 transition-colors cursor-pointer"
                  aria-label="Delete task"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex items-center justify-between pt-3 mt-3 border-t border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500">
        <span className="font-mono-tabular">{activeCount} task(s) remaining</span>
        <button
          type="button"
          onClick={() => setTasks(DEFAULT_DEMO_TASKS)}
          className="inline-flex items-center gap-1 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          Reset sample tasks
        </button>
      </div>
    </div>
  );
};

export const InteractiveCalculatorDemo: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
      return;
    }
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const clearAll = () => {
    setDisplay('0');
    setExpression('');
    setWaitingForOperand(false);
  };

  const toggleSign = () => {
    const val = parseFloat(display);
    if (val === 0) return;
    setDisplay(String(val * -1));
  };

  const inputPercent = () => {
    const val = parseFloat(display);
    setDisplay(String(Number((val / 100).toPrecision(10))));
  };

  const handleOperator = (nextOp: string) => {
    const inputValue = parseFloat(display);

    if (expression && !waitingForOperand) {
      const parts = expression.trim().split(' ');
      const prevVal = parseFloat(parts[0]);
      const prevOp = parts[1];
      let result = inputValue;

      if (prevOp === '+') result = prevVal + inputValue;
      else if (prevOp === '-') result = prevVal - inputValue;
      else if (prevOp === '×') result = prevVal * inputValue;
      else if (prevOp === '÷') result = inputValue !== 0 ? prevVal / inputValue : 0;

      const formatted = String(Number(result.toPrecision(10)));
      setDisplay(formatted);
      setExpression(nextOp === '=' ? '' : `${formatted} ${nextOp}`);
    } else {
      setExpression(nextOp === '=' ? '' : `${display} ${nextOp}`);
    }
    setWaitingForOperand(true);
  };

  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#0D0D12] p-5">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <span className="text-xs text-violet-600 dark:text-violet-400 font-medium">
            Interactive Live Sandbox · HTML/CSS/JS Logic
          </span>
          <h4 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mt-0.5">
            Online Calculator Application
          </h4>
        </div>
        <button
          type="button"
          onClick={clearAll}
          className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          Clear Display
        </button>
      </div>

      <div className="max-w-xs mx-auto bg-zinc-900 text-white rounded-xl p-4 border border-zinc-800">
        <div className="text-right mb-3 px-2 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800/80">
          <div className="text-xs text-zinc-400 font-mono-tabular h-4">{expression || '0'}</div>
          <div className="text-2xl font-bold font-mono-tabular tracking-tight truncate mt-0.5">
            {display}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 font-mono-tabular">
          <button
            type="button"
            onClick={clearAll}
            className="py-2.5 text-xs font-semibold rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors cursor-pointer"
          >
            AC
          </button>
          <button
            type="button"
            onClick={toggleSign}
            className="py-2.5 text-xs font-semibold rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors cursor-pointer"
          >
            +/-
          </button>
          <button
            type="button"
            onClick={inputPercent}
            className="py-2.5 text-xs font-semibold rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors cursor-pointer"
          >
            %
          </button>
          <button
            type="button"
            onClick={() => handleOperator('÷')}
            className="py-2.5 text-sm font-semibold rounded-lg bg-violet-600 hover:bg-violet-500 text-white transition-colors cursor-pointer"
          >
            ÷
          </button>

          {['7', '8', '9'].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => inputDigit(n)}
              className="py-2.5 text-sm font-medium rounded-lg bg-zinc-800/70 hover:bg-zinc-700 text-white transition-colors cursor-pointer"
            >
              {n}
            </button>
          ))}
          <button
            type="button"
            onClick={() => handleOperator('×')}
            className="py-2.5 text-sm font-semibold rounded-lg bg-violet-600 hover:bg-violet-500 text-white transition-colors cursor-pointer"
          >
            ×
          </button>

          {['4', '5', '6'].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => inputDigit(n)}
              className="py-2.5 text-sm font-medium rounded-lg bg-zinc-800/70 hover:bg-zinc-700 text-white transition-colors cursor-pointer"
            >
              {n}
            </button>
          ))}
          <button
            type="button"
            onClick={() => handleOperator('-')}
            className="py-2.5 text-sm font-semibold rounded-lg bg-violet-600 hover:bg-violet-500 text-white transition-colors cursor-pointer"
          >
            −
          </button>

          {['1', '2', '3'].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => inputDigit(n)}
              className="py-2.5 text-sm font-medium rounded-lg bg-zinc-800/70 hover:bg-zinc-700 text-white transition-colors cursor-pointer"
            >
              {n}
            </button>
          ))}
          <button
            type="button"
            onClick={() => handleOperator('+')}
            className="py-2.5 text-sm font-semibold rounded-lg bg-violet-600 hover:bg-violet-500 text-white transition-colors cursor-pointer"
          >
            +
          </button>

          <button
            type="button"
            onClick={() => inputDigit('0')}
            className="col-span-2 py-2.5 text-sm font-medium rounded-lg bg-zinc-800/70 hover:bg-zinc-700 text-white transition-colors cursor-pointer"
          >
            0
          </button>
          <button
            type="button"
            onClick={inputDecimal}
            className="py-2.5 text-sm font-medium rounded-lg bg-zinc-800/70 hover:bg-zinc-700 text-white transition-colors cursor-pointer"
          >
            .
          </button>
          <button
            type="button"
            onClick={() => handleOperator('=')}
            className="py-2.5 text-sm font-semibold rounded-lg bg-violet-500 hover:bg-violet-400 text-white transition-colors cursor-pointer"
          >
            =
          </button>
        </div>
      </div>
    </div>
  );
};
