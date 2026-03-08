
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../context/UserContext';
import { Calendar, ClipboardList, FileText, HelpCircle, ChevronRight, Sparkles } from 'lucide-react';

export default function IntroScreen() {
  const { setUserName, setHasSeenIntro } = useUser();
  const [name, setName] = useState('');
  const [step, setStep] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      setUserName(name.trim());
      setStep(1);
      setTimeout(() => {
        setHasSeenIntro(true);
      }, 1500);
    }
  };

  const features = [
    { icon: Calendar, text: 'Kelola Jadwal Kuliah', color: 'from-pink-500 to-rose-500' },
    { icon: ClipboardList, text: 'Tugas Terorganisir', color: 'from-violet-500 to-purple-500' },
    { icon: FileText, text: 'Tracking Ujian', color: 'from-cyan-500 to-blue-500' },
    { icon: HelpCircle, text: 'Pengingat Kuis', color: 'from-amber-500 to-orange-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center p-6 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -180, -360],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-pink-500/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-3xl"
        />
      </div>

      {/* Floating Elements */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: [0.3, 0.8, 0.3], 
            scale: [1, 1.2, 1],
            y: [0, -20, 0],
          }}
          transition={{ 
            duration: 3 + i * 0.5, 
            repeat: Infinity, 
            delay: i * 0.3,
            ease: 'easeInOut'
          }}
          className="absolute w-2 h-2 bg-white/30 rounded-full"
          style={{
            left: `${20 + i * 15}%`,
            top: `${30 + (i % 3) * 20}%`,
          }}
        />
      ))}

      <AnimatePresence mode="wait">
        {step === 0 ? (
          <motion.div
            key="step0"
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.2, y: -50 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="relative z-10 w-full max-w-md"
          >
            {/* Logo */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, type: 'spring', delay: 0.2 }}
              className="flex justify-center mb-8"
            >
              <div className="relative">
                <motion.div
                  animate={{ 
                    boxShadow: ['0 0 0 0 rgba(139, 92, 246, 0.4)', '0 0 0 20px rgba(139, 92, 246, 0)', '0 0 0 0 rgba(139, 92, 246, 0.4)']
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-28 h-28 bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl"
                >
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3">
                    <Calendar className="w-10 h-10 text-white" strokeWidth={2.5} />
                  </div>
                </motion.div>
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-2 -right-2"
                >
                  <Sparkles className="w-8 h-8 text-yellow-300" />
                </motion.div>
              </div>
            </motion.div>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center mb-8"
            >
              <h1 className="text-4xl font-bold text-white mb-2">
                Jadwal <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">Pruy</span>
              </h1>
              <p className="text-white/70 text-lg">Atur kampusmu dengan stylish!</p>
            </motion.div>

            {/* Name Input */}
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white/10 backdrop-blur-md rounded-3xl p-6 shadow-2xl border border-white/20"
            >
              <label className="block text-white/90 text-sm font-medium mb-3">
                Siapa Namamu? 
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ketik namamu..."
                className="w-full px-5 py-4 bg-white/20 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent text-lg transition-all"
                autoFocus
              />
              <motion.button
                type="submit"
                disabled={!name.trim()}
                whileHover={{ scale: name.trim() ? 1.02 : 1 }}
                whileTap={{ scale: name.trim() ? 0.98 : 1 }}
                className={`w-full mt-4 py-4 rounded-2xl font-semibold text-lg flex items-center justify-center gap-2 transition-all ${
                  name.trim()
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg hover:shadow-pink-500/25'
                    : 'bg-white/20 text-white/50 cursor-not-allowed'
                }`}
              >
                Lanjutkan
                {name.trim() && <ChevronRight className="w-5 h-5" />}
              </motion.button>
            </motion.form>

            {/* Features Preview */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex justify-center gap-3 mt-6 flex-wrap"
            >
              {features.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + i * 0.1 }}
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center shadow-lg`}
                >
                  <f.icon className="w-5 h-5 text-white" />
                </motion.div>
              ))}
            </motion.div>

            {/* Copyright */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-center mt-8"
            >
              <p className="text-white/40 text-xs">
                Made by <a href="https://github.com/zann06" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-white/70 transition-colors">@frrdznnnn</a>
              </p>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="step1"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.5 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 text-center"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0],
              }}
              transition={{ duration: 0.5 }}
              className="text-7xl mb-6"
            >
              👋
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold text-white mb-2"
            >
              Halo, {name}! 
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-white/70"
            >
              Siap organize kampusmu hari ini?
            </motion.p>
            
            {/* Loading dots */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex justify-center gap-2 mt-8"
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ 
                    scale: [0.8, 1.2, 0.8],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{ 
                    duration: 0.8, 
                    repeat: Infinity, 
                    delay: i * 0.2 
                  }}
                  className="w-3 h-3 bg-white/70 rounded-full"
                />
              ))}
            </motion.div>

            {/* Copyright for step 1 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-center mt-8"
            >
              <p className="text-white/40 text-xs">
                Made by <a href="https://github.com/zann06" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-white/70 transition-colors">@frrdznnnn</a>
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

