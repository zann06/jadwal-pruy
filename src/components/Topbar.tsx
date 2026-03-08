import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Sun, Moon, Menu, X, User } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface TopbarProps {
  onMenuClick: () => void;
  sidebarOpen: boolean;
  onSidebarToggle: () => void;
}

export default function Topbar({ onMenuClick, sidebarOpen, onSidebarToggle }: TopbarProps) {
  const { theme, toggleTheme } = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="fixed top-0 left-0 right-0 z-30 h-14 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-700/50 lg:relative lg:h-16 lg:border-b-0">
      <div className="flex items-center justify-between h-full px-3 lg:px-4">

        {/* LEFT SIDE */}
        <div className="flex items-center gap-2 lg:gap-3">

          {/* Mobile menu */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Menu className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </button>

          {/* Desktop sidebar toggle */}
          <button
            onClick={onSidebarToggle}
            className="hidden lg:flex p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {sidebarOpen ? (
              <X className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            ) : (
              <Menu className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            )}
          </button>

          {/* SEARCH */}
          <div
            className={`relative hidden sm:block ${
              searchOpen ? 'w-48 md:w-64 lg:w-80' : 'w-0'
            } transition-all duration-300 overflow-hidden`}
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

            <input
              type="text"
              placeholder="Cari..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 lg:py-2 bg-slate-100 dark:bg-slate-800 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white placeholder-slate-500"
            />
          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-1 lg:gap-2">

          {/* Mobile search */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="sm:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {searchOpen ? (
              <X className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            ) : (
              <Search className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            )}
          </button>

          {/* Theme toggle */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            ) : (
              <Moon className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            )}
          </motion.button>

          {/* Profile */}
          <button className="flex items-center gap-2 p-1.5 lg:p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
          </button>

        </div>

      </div>
    </header>
  );
}
