import { useState } from 'react';
import { SimpleDialog } from './SimpleDialog';
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import type { Category, EventTemplate } from '../App';

interface SettingsDialogProps {
  show: boolean;
  onClose: () => void;
  categories: Category[];
  setCategories: (categories: Category[]) => void;
  templates: EventTemplate[];
  setTemplates: (templates: EventTemplate[]) => void;
}

export function SettingsDialog({
  show,
  onClose,
  categories,
  setCategories,
  templates,
  setTemplates
}: SettingsDialogProps) {
  const [activeTab, setActiveTab] = useState<'categories' | 'templates'>('categories');
  
  // Category editing
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('#3b82f6');
  
  // Template editing
  const [showTemplateForm, setShowTemplateForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<EventTemplate | null>(null);
  const [templateName, setTemplateName] = useState('');
  const [templateCategory, setTemplateCategory] = useState('');
  const [relatedTasks, setRelatedTasks] = useState<{ text: string; daysBefore: number; categoryId?: string }[]>([]);
  
  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      const newCategory: Category = {
        id: Date.now().toString(),
        name: newCategoryName.trim(),
        color: newCategoryColor
      };
      setCategories([...categories, newCategory]);
      setNewCategoryName('');
      setNewCategoryColor('#3b82f6');
    }
  };
  
  const handleUpdateCategory = (id: string, updates: Partial<Category>) => {
    setCategories(categories.map(cat => 
      cat.id === id ? { ...cat, ...updates } : cat
    ));
  };
  
  const handleDeleteCategory = (id: string) => {
    setCategories(categories.filter(cat => cat.id !== id));
  };
  
  const handleAddRelatedTask = () => {
    setRelatedTasks([...relatedTasks, { text: '', daysBefore: 1 }]);
  };
  
  const handleUpdateRelatedTask = (index: number, updates: Partial<typeof relatedTasks[0]>) => {
    setRelatedTasks(relatedTasks.map((task, i) => 
      i === index ? { ...task, ...updates } : task
    ));
  };
  
  const handleDeleteRelatedTask = (index: number) => {
    setRelatedTasks(relatedTasks.filter((_, i) => i !== index));
  };
  
  const handleSaveTemplate = () => {
    if (!templateName.trim() || !templateCategory) return;
    
    const template: EventTemplate = {
      id: editingTemplate?.id || Date.now().toString(),
      name: templateName.trim(),
      categoryId: templateCategory,
      relatedTasks: relatedTasks.filter(task => task.text.trim())
    };
    
    if (editingTemplate) {
      setTemplates(templates.map(t => t.id === editingTemplate.id ? template : t));
    } else {
      setTemplates([...templates, template]);
    }
    
    resetTemplateForm();
  };
  
  const resetTemplateForm = () => {
    setShowTemplateForm(false);
    setEditingTemplate(null);
    setTemplateName('');
    setTemplateCategory('');
    setRelatedTasks([]);
  };
  
  const handleEditTemplate = (template: EventTemplate) => {
    setEditingTemplate(template);
    setTemplateName(template.name);
    setTemplateCategory(template.categoryId);
    setRelatedTasks(template.relatedTasks);
    setShowTemplateForm(true);
  };
  
  const handleDeleteTemplate = (id: string) => {
    setTemplates(templates.filter(t => t.id !== id));
  };
  
  return (
    <SimpleDialog
      open={show}
      onOpenChange={onClose}
      title="Settings"
    >
      <div className="space-y-4">
        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-2 -mb-px ${
              activeTab === 'categories'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Categories
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`px-4 py-2 -mb-px ${
              activeTab === 'templates'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Event Templates
          </button>
        </div>
        
        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div className="space-y-4">
            {/* Category List */}
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center gap-2 p-2 border border-gray-200 rounded">
                  {editingCategoryId === category.id ? (
                    <>
                      <input
                        type="color"
                        value={category.color}
                        onChange={(e) => handleUpdateCategory(category.id, { color: e.target.value })}
                        className="w-8 h-8 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={category.name}
                        onChange={(e) => handleUpdateCategory(category.id, { name: e.target.value })}
                        className="flex-1 px-2 py-1 border border-gray-300 rounded bg-white text-gray-900"
                        autoFocus
                      />
                      <button
                        onClick={() => setEditingCategoryId(null)}
                        className="p-1 text-green-600 hover:text-green-700"
                      >
                        <Check size={18} />
                      </button>
                    </>
                  ) : (
                    <>
                      <div
                        className="w-8 h-8 rounded border border-gray-300"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="flex-1 text-gray-900">{category.name}</span>
                      <button
                        onClick={() => setEditingCategoryId(category.id)}
                        className="p-1 text-blue-600 hover:text-blue-700"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="p-1 text-red-600 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
            
            {/* Add Category */}
            <div className="flex gap-2 items-center border-t pt-4">
              <input
                type="color"
                value={newCategoryColor}
                onChange={(e) => setNewCategoryColor(e.target.value)}
                className="w-10 h-10 rounded cursor-pointer"
              />
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                placeholder="New category name..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400"
              />
              <button
                onClick={handleAddCategory}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2"
              >
                <Plus size={18} />
                Add
              </button>
            </div>
          </div>
        )}
        
        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div className="space-y-4">
            {!showTemplateForm ? (
              <>
                {/* Template List */}
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {templates.map((template) => {
                    const category = categories.find(c => c.id === template.categoryId);
                    return (
                      <div key={template.id} className="p-3 border border-gray-200 rounded">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {category && (
                              <div
                                className="w-4 h-4 rounded"
                                style={{ backgroundColor: category.color }}
                              />
                            )}
                            <span className="font-medium text-gray-900">{template.name}</span>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditTemplate(template)}
                              className="p-1 text-blue-600 hover:text-blue-700"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteTemplate(template.id)}
                              className="p-1 text-red-600 hover:text-red-700"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          {template.relatedTasks.map((task, idx) => {
                            const taskCat = categories.find(c => c.id === task.categoryId);
                            return (
                              <div key={idx} className="flex items-center gap-2">
                                {taskCat && (
                                  <div
                                    className="w-3 h-3 rounded"
                                    style={{ backgroundColor: taskCat.color }}
                                  />
                                )}
                                <span>• {task.text} ({task.daysBefore} day{task.daysBefore !== 1 ? 's' : ''} before)</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                  {templates.length === 0 && (
                    <p className="text-gray-400 text-center py-8">No templates yet. Create one below!</p>
                  )}
                </div>
                
                {/* Add Template Button */}
                <button
                  onClick={() => setShowTemplateForm(true)}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center justify-center gap-2"
                >
                  <Plus size={18} />
                  Create Template
                </button>
              </>
            ) : (
              <>
                {/* Template Form */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm mb-1">Template Name</label>
                    <input
                      type="text"
                      value={templateName}
                      onChange={(e) => setTemplateName(e.target.value)}
                      placeholder="e.g., Event Planning"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm mb-1">Main Event Category</label>
                    <select
                      value={templateCategory}
                      onChange={(e) => setTemplateCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900"
                    >
                      <option value="" className="text-gray-900">Select category...</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id} className="text-gray-900">{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm mb-2">Related Tasks (created automatically)</label>
                    <div className="space-y-2 max-h-[200px] overflow-y-auto">
                      {relatedTasks.map((task, idx) => (
                        <div key={idx} className="flex gap-2 items-start p-2 border border-gray-200 rounded">
                          <div className="flex-1 space-y-2">
                            <input
                              type="text"
                              value={task.text}
                              onChange={(e) => handleUpdateRelatedTask(idx, { text: e.target.value })}
                              placeholder="Task description..."
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm bg-white text-gray-900 placeholder-gray-400"
                            />
                            <div className="flex gap-2">
                              <input
                                type="number"
                                value={task.daysBefore}
                                onChange={(e) => handleUpdateRelatedTask(idx, { daysBefore: parseInt(e.target.value) || 1 })}
                                min="1"
                                className="w-20 px-2 py-1 border border-gray-300 rounded text-sm bg-white text-gray-900"
                              />
                              <span className="text-sm text-gray-600 py-1">days before</span>
                              <select
                                value={task.categoryId || ''}
                                onChange={(e) => handleUpdateRelatedTask(idx, { categoryId: e.target.value || undefined })}
                                className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm bg-white text-gray-900"
                              >
                                <option value="" className="text-gray-900">No category</option>
                                {categories.map(cat => (
                                  <option key={cat.id} value={cat.id} className="text-gray-900">{cat.name}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteRelatedTask(idx)}
                            className="p-1 text-red-600 hover:text-red-700 mt-1"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={handleAddRelatedTask}
                      className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm flex items-center justify-center gap-2"
                    >
                      <Plus size={16} />
                      Add Related Task
                    </button>
                  </div>
                  
                  <div className="flex gap-2 pt-2 border-t">
                    <button
                      onClick={resetTemplateForm}
                      className="flex-1 px-4 py-2 bg-gray-600 text-white border border-gray-600 rounded-md hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveTemplate}
                      disabled={!templateName.trim() || !templateCategory}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      {editingTemplate ? 'Update' : 'Create'} Template
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </SimpleDialog>
  );
}