import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Download, Trash2, AlertTriangle, Check } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useData } from '../context/DataContext';

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const { resetData, exportData } = useData();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jadwal-pruy-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 3000);
  };

  const handleReset = () => {
    resetData();
    setShowResetConfirm(false);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
          Settings
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Kelola pengaturan aplikasi
        </p>
      </div>

      {/* Theme Settings */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-soft"
      >
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          Tampilan
        </h2>
        
        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
          <div className="flex items-center gap-3">
            {theme === 'dark' ? (
              <Moon className="w-5 h-5 text-primary" />
            ) : (
              <Sun className="w-5 h-5 text-primary" />
            )}
            <div>
              <p className="font-medium text-slate-900 dark:text-white">
                Dark Mode
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {theme === 'dark' ? 'Mode gelap aktif' : 'Mode terang aktif'}
              </p>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            className={`relative w-14 h-8 rounded-full transition-colors ${
              theme === 'dark' ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-600'
            }`}
          >
            <motion.div
              animate={{ x: theme === 'dark' ? 26 : 2 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md"
            />
          </button>
        </div>
      </motion.div>

      {/* Data Management */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-soft"
      >
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          Data
        </h2>
        
        <div className="space-y-3">
          {/* Export */}
          <button
            onClick={handleExport}
            className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <div className="flex items-center gap-3">
              {exportSuccess ? (
                <Check className="w-5 h-5 text-green-500" />
              ) : (
                <Download className="w-5 h-5 text-primary" />
              )}
              <div className="text-left">
                <p className="font-medium text-slate-900 dark:text-white">
                  Export Data
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {exportSuccess ? 'Berhasil export!' : 'Simpan semua data ke file JSON'}
                </p>
              </div>
            </div>
          </button>

          {/* Reset */}
          <button
            onClick={() => setShowResetConfirm(true)}
            className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <Trash2 className="w-5 h-5 text-red-500 group-hover:text-red-600" />
              <div className="text-left">
                <p className="font-medium text-slate-900 dark:text-white group-hover:text-red-600">
                  Reset Data
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Hapus semua data (tidak dapat dikembalikan)
                </p>
              </div>
            </div>
          </button>
        </div>
      </motion.div>

      {/* About */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-soft"
      >
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          Tentang
        </h2>
        
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">JP</span>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">Jadwal Pruy</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Versi 1.0.0</p>
            </div>
          </div>
          
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Aplikasi manajemen aktivitas harian untuk mahasiswa. 
            Atur jadwal kuliah, tugas, kuis, dan ujian dalam satu dashboard yang rapi.
          </p>
          
          <p className="text-xs text-slate-400 dark:text-slate-500 pt-2 border-t border-slate-200 dark:border-slate-700">
            Made by @frrdznnnn 
          </p>
        </div>
      </motion.div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setShowResetConfirm(false)}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Konfirmasi Reset Data
              </h3>
            </div>
            
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              Apakah Anda yakin ingin mereset semua data? Tindakan ini tidak dapat dibatalkan dan semua jadwal, tugas, ujian, serta kuis akan dihapus permanen.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleReset}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Reset Sekarang
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

