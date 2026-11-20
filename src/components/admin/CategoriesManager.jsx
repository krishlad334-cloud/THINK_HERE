import React, { useState } from 'react';
import { FolderKanban, Plus } from 'lucide-react';

export default function CategoriesManager() {
  const [categories, setCategories] = useState([
    { id: 'cat-1', name: 'Career & Jobs', count: 48, status: 'Active' },
    { id: 'cat-2', name: 'Business & Startups', count: 62, status: 'Active' },
    { id: 'cat-3', name: 'Technology & IT', count: 89, status: 'Active' },
    { id: 'cat-4', name: 'Product & Innovation', count: 37, status: 'Active' },
    { id: 'cat-5', name: 'Marketing & Growth', count: 29, status: 'Active' },
    { id: 'cat-6', name: 'Personal Development', count: 18, status: 'Active' }
  ]);
  const [newCatName, setNewCatName] = useState('');

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    setCategories(prev => [
      ...prev,
      { id: 'cat-' + Date.now(), name: newCatName.trim(), count: 0, status: 'Active' }
    ]);
    setNewCatName('');
  };

  return (
    <div className="space-y-6 w-full pb-16">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
          <FolderKanban className="w-7 h-7 text-[#004845]" />
          <span>Categories & Domain Skills Management</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Configure thought categorization tags, AI domain models, and consultant specializations
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-8 space-y-5 shadow-xs">
        <form onSubmit={handleAddCategory} className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            placeholder="Add new thought category (e.g. Health & Biotech, Legal Tech)..."
            className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#004845]/20 focus:border-[#004845]"
          />
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-[#004845] hover:bg-[#003331] text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs flex-shrink-0"
          >
            <Plus className="w-3.5 h-3.5 text-[#16a34a]" />
            <span>Add Category</span>
          </button>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-2">
          {categories.map((c) => (
            <div key={c.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900">{c.name}</h4>
                <p className="text-[10px] text-slate-400">{c.count} active submissions</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                {c.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
