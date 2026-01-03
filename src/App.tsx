import { useState } from "react";
import { MonthCalendar } from "./components/MonthCalendar";
import { Settings, AlertCircle } from "lucide-react";
import { SettingsDialog } from "./components/SettingsDialog";
import { OverdueTasksDialog } from "./components/OverdueTasksDialog";

export interface TodoItem {
  id: string;
  text: string;
  done: boolean;
  category?: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface EventTemplate {
  id: string;
  name: string;
  categoryId: string;
  relatedTasks: {
    text: string;
    daysBefore: number;
    categoryId?: string;
  }[];
}

export default function App() {
  const year = 2026;
  const months = Array.from({ length: 12 }, (_, i) => i);

  // Store todos by date key (YYYY-MM-DD)
  const [todos, setTodos] = useState<
    Record<string, TodoItem[]>
  >({});

  // Categories with default ones
  const [categories, setCategories] = useState<Category[]>([
    { id: "work", name: "Work", color: "#3b82f6" },
    { id: "personal", name: "Personal", color: "#10b981" },
    { id: "event", name: "Event", color: "#f59e0b" },
    { id: "social", name: "Social Media", color: "#8b5cf6" },
  ]);

  // Event templates
  const [templates, setTemplates] = useState<EventTemplate[]>([
    {
      id: "event-planning",
      name: "Event Planning",
      categoryId: "event",
      relatedTasks: [
        {
          text: "Collect information about the event",
          daysBefore: 7,
          categoryId: "work",
        },
        {
          text: "Post the event on Instagram",
          daysBefore: 3,
          categoryId: "social",
        },
        {
          text: "Send event reminders",
          daysBefore: 1,
          categoryId: "work",
        },
      ],
    },
  ]);

  const [showSettings, setShowSettings] = useState(false);
  const [showOverdueTasks, setShowOverdueTasks] =
    useState(false);

  const handleUpdateTodos = (
    date: string,
    items: TodoItem[],
  ) => {
    setTodos((prev) => ({
      ...prev,
      [date]: items,
    }));
  };

  const handleAddTodoWithTemplate = (
    date: string,
    todo: TodoItem,
    templateId?: string,
  ) => {
    // Add the main todo
    const dateItems = todos[date] || [];
    handleUpdateTodos(date, [...dateItems, todo]);

    // If a template is selected, create related tasks
    if (templateId) {
      const template = templates.find(
        (t) => t.id === templateId,
      );
      if (template) {
        const mainDate = new Date(date + "T00:00:00");

        template.relatedTasks.forEach((task) => {
          const taskDate = new Date(mainDate);
          taskDate.setDate(
            taskDate.getDate() - task.daysBefore,
          );

          const taskDateKey = taskDate
            .toISOString()
            .split("T")[0];
          const newTask: TodoItem = {
            id: Date.now().toString() + Math.random(),
            text: task.text,
            done: false,
            category: task.categoryId,
          };

          const existingTodos = todos[taskDateKey] || [];
          handleUpdateTodos(taskDateKey, [
            ...existingTodos,
            newTask,
          ]);
        });
      }
    }
  };

  const handleToggleTodoFromOverdue = (
    date: string,
    todoId: string,
  ) => {
    const dateTodos = todos[date] || [];
    const updatedTodos = dateTodos.map((todo) =>
      todo.id === todoId ? { ...todo, done: !todo.done } : todo,
    );
    handleUpdateTodos(date, updatedTodos);
  };

  return (
    <div className="min-h-screen bg-[rgb(3,77,174)] py-8 px-4">
      <div className="max-w-[1920px] mx-auto">
        <div className="flex items-center justify-between mb-2">
          <div className="flex-1"></div>
          <h1 className="text-center text-[rgb(255,255,255)] text-[32px] font-bold">International Polimeet 2026 PED</h1>
          <div className="flex-1 flex justify-end gap-2">
            <button
              className="bg-white hover:bg-gray-100 p-3 rounded-full shadow-md border border-gray-200 transition-colors"
              onClick={() => setShowOverdueTasks(true)}
              title="Overdue Tasks"
            >
              <AlertCircle size={20} />
            </button>
            <button
              className="bg-white hover:bg-gray-100 p-3 rounded-full shadow-md border border-gray-200 transition-colors"
              onClick={() => setShowSettings(true)}
              title="Settings"
            >
              <Settings size={20} />
            </button>
          </div>
        </div>
        <p className="text-center text-[rgb(255,255,255)] mb-8">
          Week starts on Monday • Click any day to add your plan
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
          {months.map((month) => (
            <MonthCalendar
              key={month}
              month={month}
              year={year}
              todos={todos}
              onUpdateTodos={handleUpdateTodos}
              onAddTodoWithTemplate={handleAddTodoWithTemplate}
              categories={categories}
              templates={templates}
            />
          ))}
        </div>

        <SettingsDialog
          show={showSettings}
          onClose={() => setShowSettings(false)}
          categories={categories}
          setCategories={setCategories}
          templates={templates}
          setTemplates={setTemplates}
        />

        <OverdueTasksDialog
          show={showOverdueTasks}
          onClose={() => setShowOverdueTasks(false)}
          todos={todos}
          categories={categories}
          onToggleTodo={handleToggleTodoFromOverdue}
        />
      </div>
    </div>
  );
}