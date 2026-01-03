import { SimpleDialog } from './SimpleDialog';
import { AlertCircle } from 'lucide-react';
import type { TodoItem, Category } from '../App';

interface OverdueTasksDialogProps {
  show: boolean;
  onClose: () => void;
  todos: Record<string, TodoItem[]>;
  categories: Category[];
  onToggleTodo: (date: string, todoId: string) => void;
}

export function OverdueTasksDialog({ 
  show, 
  onClose, 
  todos, 
  categories,
  onToggleTodo 
}: OverdueTasksDialogProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Get all overdue tasks (not done and date is before today)
  const overdueTasks: { date: string; task: TodoItem; dateObj: Date }[] = [];
  
  Object.entries(todos).forEach(([dateKey, tasks]) => {
    const dateObj = new Date(dateKey + 'T00:00:00');
    if (dateObj < today) {
      tasks.forEach(task => {
        if (!task.done) {
          overdueTasks.push({ date: dateKey, task, dateObj });
        }
      });
    }
  });
  
  // Sort by date (oldest first)
  overdueTasks.sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
  };
  
  const getDaysOverdue = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    const diff = today.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return days;
  };
  
  return (
    <SimpleDialog
      open={show}
      onOpenChange={onClose}
      title="Overdue Tasks"
    >
      <div className="space-y-4">
        {overdueTasks.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">🎉 All caught up! No overdue tasks.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 text-orange-600 bg-orange-50 p-3 rounded-md">
              <AlertCircle size={20} />
              <span className="font-medium">{overdueTasks.length} incomplete task{overdueTasks.length !== 1 ? 's' : ''}</span>
            </div>
            
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {overdueTasks.map(({ date, task }) => {
                const category = categories.find(c => c.id === task.category);
                const daysOverdue = getDaysOverdue(date);
                
                return (
                  <div 
                    key={`${date}-${task.id}`}
                    className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={task.done}
                        onChange={() => onToggleTodo(date, task.id)}
                        className="mt-1 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {category && (
                            <div
                              className="w-3 h-3 rounded"
                              style={{ backgroundColor: category.color }}
                            />
                          )}
                          <span className="text-gray-900">{task.text}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <span className="text-gray-600">{formatDate(date)}</span>
                          <span className="text-orange-600 font-medium">
                            {daysOverdue} day{daysOverdue !== 1 ? 's' : ''} overdue
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </SimpleDialog>
  );
}
