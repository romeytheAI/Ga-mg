import React, { useState, useMemo } from 'react';
import { Heart, Shield, Zap, Flame, Moon, Sun, Briefcase, MessageCircle, Users, Target, ArrowRight, Search } from 'lucide-react';

export interface Choice {
  id: string;
  label: string;
  description?: string;
  icon?: string;
  intent: 'neutral''| 'social''| 'work''| 'combat''| 'flirt''| 'stealth''| 'travel';
  disabled?: boolean;
  disabledReason?: string;
  cost?: { type: string; amount: number };
}

export interface ChoiceCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  choices: Choice[];
}

interface ActionChoiceGridProps {
  categories: ChoiceCategory[];
  onSelect: (choice: Choice) => void;
  selectedCategory?: string;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

const INTENT_ICONS: Record<string, React.ReactNode> = {
  neutral: <MessageCircle size={16} />,
  social: <Users size={16} />,
  work: <Briefcase size={16} />,
  combat: <Shield size={16} />,
  flirt: <Heart size={16} />,
  stealth: <Search size={16} />,
  travel: <Target size={16} />,
};

const INTENT_COLORS: Record<string, string> = {
  neutral: 'bg-gray-500/20 border-gray-500/50 text-gray-300',
  social: 'bg-blue-500/20 border-blue-500/50 text-blue-300',
  work: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300',
  combat: 'bg-red-500/20 border-red-500/50 text-red-300',
  flirt: 'bg-pink-500/20 border-pink-500/50 text-pink-300',
  stealth: 'bg-purple-500/20 border-purple-500/50 text-purple-300',
  travel: 'bg-green-500/20 border-green-500/50 text-green-300',
};

export const ActionChoiceGrid: React.FC<ActionChoiceGridProps> = ({
  categories,
  onSelect,
  selectedCategory,
  searchQuery = ',
  onSearchChange
}) => {
  const [activeTab, setActiveTab] = useState<string>(selectedCategory || categories[0]?.id || 'all');

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    
    const query = searchQuery.toLowerCase();
    return categories.map(cat => ({
      ...cat,
      choices: cat.choices.filter(choice => 
        choice.label.toLowerCase().includes(query) ||
        choice.description?.toLowerCase().includes(query)
      )
    })).filter(cat => cat.choices.length > 0);
  }, [categories, searchQuery]);

  const activeChoices = useMemo(() => {
    if (activeTab === 'all') {
      return filteredCategories.flatMap(cat => cat.choices);
    }
    return filteredCategories.find(cat => cat.id === activeTab)?.choices || [];
  }, [filteredCategories, activeTab]);

  const allChoicesCount = useMemo(() => 
    filteredCategories.reduce((sum, cat) => sum + cat.choices.length, 0), 
    [filteredCategories]
  );

  return (
    <div className="action-choice-grid w-full max-w-4xl mx-auto">
      {onSearchChange && (
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search actions..."
            className="w-full pl-10 pr-4 py-3 bg-gray-900/80 border border-purple-500/30 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:border-purple-500/60 transition-colors"
          />
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-4 p-1 bg-gray-900/50 rounded-lg overflow-x-auto">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
            activeTab === 'all''
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30''
              : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
          }`}
        >
          All ({allChoicesCount})
        </button>
        {filteredCategories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveTab(cat.id)}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === cat.id 
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30''
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
            }`}
          >
            {cat.icon}
            <span>{cat.name}</span>
            <span className="text-xs opacity-70">({cat.choices.length})</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[400px] overflow-y-auto custom-scrollbar p-1">
        {activeChoices.map((choice) => (
          <button
            key={choice.id}
            onClick={() => !choice.disabled && onSelect(choice)}
            disabled={choice.disabled}
            className={`
              group relative flex flex-col items-start p-3 rounded-xl border transition-all duration-200
              ${choice.disabled 
                ? 'opacity-50 cursor-not-allowed border-gray-700/50 bg-gray-900/30''
                : `${INTENT_COLORS[choice.intent]} hover:scale-105 hover:shadow-lg cursor-pointer`
              }
            `}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="opacity-70">{INTENT_ICONS[choice.intent]}</span>
              <span className="font-semibold text-sm line-clamp-1">{choice.label}</span>
            </div>
            
            {choice.description && (
              <p className="text-xs opacity-60 line-clamp-2 text-left w-full">{choice.description}</p>
            )}
            
            {choice.cost && (
              <div className="mt-2 text-xs opacity-70 flex items-center gap-1">
                {choice.cost.type === 'gold''&& <span>💰</span>}
                {choice.cost.type === 'time''&& <span>⏱️</span>}
                {choice.cost.type === 'stamina''&& <span>⚡</span>}
                <span>{choice.cost.amount}</span>
              </div>
            )}
            
            {choice.disabled && choice.disabledReason && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 rounded-xl">
                <span className="text-xs text-red-400 px-2 text-center">{choice.disabledReason}</span>
              </div>
            )}
            
            <ArrowRight 
              size={14} 
              className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" 
            />
          </button>
        ))}
        
        {activeChoices.length === 0 && (
          <div className="col-span-full text-center py-8 text-gray-500">
            <Search size={32} className="mx-auto mb-2 opacity-50" />
            <p>No actions match your search</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActionChoiceGrid;