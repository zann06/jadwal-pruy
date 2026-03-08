import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Calendar, 
  ClipboardList, 
  FileText, 
  HelpCircle 
} from 'lucide-react';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Home' },
  { path: '/jadwal', icon: Calendar, label: 'Jadwal' },
  { path: '/tugas', icon: ClipboardList, label: 'Tugas' },
  { path: '/ujian', icon: FileText, label: 'Ujian' },
  { path: '/kuis', icon: HelpCircle, label: 'Kuis' },
];

export default function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200/50 dark:border-slate-700/50 lg:hidden z-50 shadow-lg safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-2 pb-safe">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className="relative flex flex-col items-center justify-center w-16 h-12 transition-transform active:scale-95"
          >
            {({ isActive }) => (
              <div className="flex flex-col items-center">
                <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-gradient-to-br from-pink-500 to-purple-500 shadow-lg' : ''}`}>
                  <item.icon className={`w-5 h-5 transition-colors ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`} />
                </div>
                <span className={`text-[10px] mt-1 font-medium ${isActive ? 'text-pink-500' : 'text-slate-400'}`}>{item.label}</span>
              </div>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
