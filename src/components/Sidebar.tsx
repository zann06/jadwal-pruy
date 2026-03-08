import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Calendar, 
  ClipboardList, 
  FileText, 
  HelpCircle, 
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import logoImg from '/logo.svg';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  mobile?: boolean;
}

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/jadwal', icon: Calendar, label: 'Jadwal' },
  { path: '/tugas', icon: ClipboardList, label: 'Tugas' },
  { path: '/ujian', icon: FileText, label: 'Ujian' },
  { path: '/kuis', icon: HelpCircle, label: 'Kuis' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar({ isOpen, onToggle, mobile }: SidebarProps) {
  return (
    <aside 
      className={`fixed top-0 left-0 h-full bg-surface-light dark:bg-surface-dark border-r border-slate-200 dark:border-slate-700 transition-all duration-300 z-50
        ${isOpen ? 'w-60' : 'w-20'}
        ${mobile ? 'lg:hidden' : ''}
      `}
    >
      <div className="flex flex-col h-full">

        {/* HEADER */}
        <div className={`flex items-center h-16 px-4 border-b border-slate-200 dark:border-slate-700 ${!isOpen && 'justify-center'}`}>
          <div className="flex items-center gap-3">
            {isOpen ? (
              <img src={logoImg} alt="Jadwal Pruy" className="w-10 h-10 rounded-xl object-contain" />
            ) : (
              <img src={logoImg} alt="Jadwal Pruy" className="w-8 h-8 rounded-xl object-contain" />
            )}

            {isOpen && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h1 className="text-lg font-bold text-slate-900 dark:text-white">
                  Jadwal Pruy
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Atur hidupmu
                </p>
              </motion.div>
            )}

          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group
                ${isActive 
                  ? 'bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-pink-600 dark:text-pink-400' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`
              }
            >
              <item.icon className={`w-5 h-5 flex-shrink-0 ${!isOpen && 'mx-auto'}`} />

              {isOpen && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="font-medium"
                >
                  {item.label}
                </motion.span>
              )}

            </NavLink>
          ))}
        </nav>

        {/* TOGGLE BUTTON */}
        {!mobile && (
          <button
            onClick={onToggle}
            className="absolute -right-3 top-20 w-6 h-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full flex items-center justify-center shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            {isOpen ? (
              <ChevronLeft className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            )}
          </button>
        )}

        {/* FOOTER */}
        {isOpen && (
          <div className="p-4 border-t border-slate-200 dark:border-slate-700">
            <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
              Made by @frrdznnnn
            </p>
          </div>
        )}

      </div>
    </aside>
  );
}
