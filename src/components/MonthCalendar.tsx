import { useState } from 'react';
import { SimpleDialog } from './SimpleDialog';
import type { TodoItem, Category, EventTemplate } from '../App';

interface MonthCalendarProps {
  month: number;
  year: number;
  todos: Record<string, TodoItem[]>;
  onUpdateTodos: (date: string, items: TodoItem[]) => void;
  onAddTodoWithTemplate: (date: string, todo: TodoItem, templateId?: string) => void;
  categories: Category[];
  templates: EventTemplate[];
}

export function MonthCalendar({ 
  month, 
  year, 
  todos, 
  onUpdateTodos,
  onAddTodoWithTemplate,
  categories,
  templates
}: MonthCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [currentTodos, setCurrentTodos] = useState<TodoItem[]>([]);
  const [newTodoText, setNewTodoText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const firstDay = new Date(year, month, 1).getDay();
  // Convert to Monday-based (0 = Monday, 6 = Sunday)
  const firstDayMonday = firstDay === 0 ? 6 : firstDay - 1;
  
  // Get number of days in month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  // Create array of day numbers
  const days = [];
  
  // Add empty cells for days before month starts
  for (let i = 0; i < firstDayMonday; i++) {
    days.push(null);
  }
  
  // Add day numbers
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }
  
  const handleDayClick = (day: number) => {
    const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(dateKey);
    setCurrentTodos(todos[dateKey] || []);
    setNewTodoText('');
    setSelectedCategory('');
    setSelectedTemplate('');
  };
  
  const handleSave = () => {
    if (selectedDate) {
      onUpdateTodos(selectedDate, currentTodos);
      setSelectedDate(null);
      setSelectedCategory('');
      setSelectedTemplate('');
    }
  };
  
  const handleAddTodo = () => {
    if (newTodoText.trim() && selectedDate) {
      const newTodo: TodoItem = {
        id: Date.now().toString(),
        text: newTodoText.trim(),
        done: false,
        category: selectedCategory || undefined
      };
      
      // If a template is selected, use the template handler
      if (selectedTemplate) {
        onAddTodoWithTemplate(selectedDate, newTodo, selectedTemplate);
        // Refresh current todos to show the newly added one
        setCurrentTodos([...currentTodos, newTodo]);
        setSelectedTemplate('');
      } else {
        setCurrentTodos([...currentTodos, newTodo]);
      }
      
      setNewTodoText('');
      setSelectedCategory('');
    }
  };
  
  const handleToggleTodo = (id: string) => {
    setCurrentTodos(currentTodos.map(todo =>
      todo.id === id ? { ...todo, done: !todo.done } : todo
    ));
  };
  
  const handleDeleteTodo = (id: string) => {
    setCurrentTodos(currentTodos.filter(todo => todo.id !== id));
  };
  
  const handleToggleTodoInCell = (day: number, id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayTodos = todos[dateKey] || [];
    const updatedTodos = dayTodos.map(todo =>
      todo.id === id ? { ...todo, done: !todo.done } : todo
    );
    onUpdateTodos(dateKey, updatedTodos);
  };
  
  const getDateKey = (day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };
  
  const isWeekend = (index: number) => {
    // Saturday is column 5, Sunday is column 6 (0-indexed)
    const dayOfWeek = index % 7;
    return dayOfWeek === 5 || dayOfWeek === 6;
  };
  
  const getCategoryColor = (categoryId?: string) => {
    if (!categoryId) return undefined;
    const category = categories.find(c => c.id === categoryId);
    return category?.color;
  };
  
  // Check if a day is today
  const isToday = (day: number) => {
    const today = new Date();
    return today.getFullYear() === year && 
           today.getMonth() === month && 
           today.getDate() === day;
  };
  
  return (
    <>
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-center">{monthNames[month]}</h3>
        </div>
        
        <div className="p-3">
          {/* Day names header */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {dayNames.map((day, idx) => (
              <div 
                key={day} 
                className={`text-center text-sm py-1 ${
                  idx === 5 || idx === 6 ? 'text-blue-600' : 'text-gray-600'
                }`}
              >
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-2">
            {days.map((day, index) => (
              <div
                key={index}
                className="aspect-square flex flex-col"
              >
                {day ? (
                  <button
                    onClick={() => handleDayClick(day)}
                    className={`w-full h-full flex flex-col border rounded hover:border-blue-300 transition-colors text-left p-2 group ${
                      isWeekend(index)
                        ? 'bg-blue-50 border-blue-100 hover:bg-blue-100'
                        : 'bg-white border-gray-200 hover:bg-blue-50/30'
                    } ${
                      isToday(day) ? 'border-blue-500' : ''
                    }`}
                  >
                    <div className={`text-sm mb-1 group-hover:text-blue-600 ${
                      isWeekend(index) ? 'text-blue-700' : 'text-gray-700'
                    }`}>
                      {day}
                    </div>
                    <div className="flex-1 text-xs overflow-hidden space-y-0.5">
                      {todos[getDateKey(day)]?.map((todo) => {
                        const categoryColor = getCategoryColor(todo.category);
                        return (
                          <div key={todo.id} className="flex items-start gap-1">
                            {categoryColor && (
                              <div
                                className="w-2 h-2 rounded-full mt-1 flex-shrink-0"
                                style={{ backgroundColor: categoryColor }}
                              />
                            )}
                            <input
                              type="checkbox"
                              checked={todo.done}
                              onChange={(e) => handleToggleTodoInCell(day, todo.id, e as any)}
                              onClick={(e) => e.stopPropagation()}
                              className="mt-0.5 flex-shrink-0 cursor-pointer"
                            />
                            <span className={`line-clamp-1 break-words ${
                              todo.done ? 'line-through text-gray-400' : 'text-gray-700'
                            }`}>
                              {todo.text}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </button>
                ) : (
                  <div className="w-full h-full"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Edit dialog */}
      <SimpleDialog
        open={selectedDate !== null}
        onOpenChange={(open) => !open && setSelectedDate(null)}
        title={selectedDate ? new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { 
          month: 'long', 
          day: 'numeric', 
          year: 'numeric' 
        }) : ''}
      >
        <div className="space-y-4">
          {/* Todo list */}
          <div className="space-y-2 max-h-[200px] overflow-y-auto">
            {currentTodos.map((todo) => {
              const categoryColor = getCategoryColor(todo.category);
              return (
                <div key={todo.id} className="flex items-start gap-2 p-2 border border-gray-200 rounded hover:bg-gray-50">
                  {categoryColor && (
                    <div
                      className="w-3 h-3 rounded-full mt-1.5 flex-shrink-0"
                      style={{ backgroundColor: categoryColor }}
                    />
                  )}
                  <input
                    type="checkbox"
                    checked={todo.done}
                    onChange={() => handleToggleTodo(todo.id)}
                    className="mt-1 flex-shrink-0 cursor-pointer"
                  />
                  <span className={`flex-1 break-words ${
                    todo.done ? 'line-through text-gray-400' : 'text-gray-700'
                  }`}>
                    {todo.text}
                  </span>
                  <button
                    onClick={() => handleDeleteTodo(todo.id)}
                    className="px-2 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm flex-shrink-0 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              );
            })}
            {currentTodos.length === 0 && (
              <p className="text-gray-400 text-center py-4">No tasks yet. Add one below!</p>
            )}
          </div>
          
          {/* Category and Template Selection */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
              >
                <option value="" className="text-gray-900">None</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id} className="text-gray-900">{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Template (auto-creates tasks)</label>
              <select
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
              >
                <option value="" className="text-gray-900">None</option>
                {templates.map(template => (
                  <option key={template.id} value={template.id} className="text-gray-900">{template.name}</option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Show template info when selected */}
          {selectedTemplate && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
              <p className="text-sm text-blue-900 mb-2">This template will also create:</p>
              <ul className="text-sm text-blue-800 space-y-1">
                {templates.find(t => t.id === selectedTemplate)?.relatedTasks.map((task, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span>•</span>
                    <span>{task.text} ({task.daysBefore} day{task.daysBefore !== 1 ? 's' : ''} earlier)</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Add new todo */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newTodoText}
              onChange={(e) => setNewTodoText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddTodo()}
              placeholder="Add a new task..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-400"
            />
            <button
              onClick={handleAddTodo}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Add
            </button>
          </div>
          
          {/* Action buttons */}
          <div className="flex justify-end gap-2 pt-2 border-t">
            <button
              onClick={() => setSelectedDate(null)}
              className="px-4 py-2 bg-gray-600 text-white border border-gray-600 rounded-md hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      </SimpleDialog>
    </>
  );
}