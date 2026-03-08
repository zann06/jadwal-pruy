import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Layout from './components/Layout';
import IntroScreen from './components/IntroScreen';
import Dashboard from './pages/Dashboard';
import Schedule from './pages/Schedule';
import Assignments from './pages/Assignments';
import Exams from './pages/Exams';
import Quizzes from './pages/Quizzes';
import Settings from './pages/Settings';
import { useUser } from './context/UserContext';

function App() {
  const { hasSeenIntro, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
        <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (!hasSeenIntro) {
    return <IntroScreen />;
  }

  return (
    <Layout>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/jadwal" element={<Schedule />} />
          <Route path="/tugas" element={<Assignments />} />
          <Route path="/ujian" element={<Exams />} />
          <Route path="/kuis" element={<Quizzes />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </AnimatePresence>
    </Layout>
  );
}

export default App;
