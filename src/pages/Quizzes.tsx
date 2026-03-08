import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, differenceInDays } from 'date-fns';
import { id } from 'date-fns/locale';
import { Plus, Edit2, Trash2, Calendar, HelpCircle, BookOpen } from 'lucide-react';
import { useData } from '../context/DataContext';
import { Quiz } from '../types';
import Modal from '../components/Modal';

export default function Quizzes() {
  const { quizzes, addQuiz, updateQuiz, deleteQuiz } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [formData, setFormData] = useState({
    course: '',
    date: '',
    material: '',
  });

  const sortedQuizzes = [...quizzes].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const getQuizStatus = (date: string) => {
    const quizDate = new Date(date);
    const daysUntil = differenceInDays(quizDate, new Date());
    
    if (daysUntil < 0) return { color: 'text-slate-400', bg: 'bg-slate-100 dark:bg-slate-800', label: 'Selesai' };
    if (daysUntil === 0) return { color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20', label: 'Hari ini' };
    if (daysUntil <= 3) return { color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20', label: `${daysUntil} hari lagi` };
    return { color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20', label: `${daysUntil} hari lagi` };
  };

  const handleOpenModal = (quiz?: Quiz) => {
    if (quiz) {
      setEditingQuiz(quiz);
      setFormData({
        course: quiz.course,
        date: quiz.date.split('T')[0],
        material: quiz.material,
      });
    } else {
      setEditingQuiz(null);
      setFormData({
        course: '',
        date: '',
        material: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingQuiz(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingQuiz) {
      updateQuiz(editingQuiz.id, formData);
    } else {
      addQuiz(formData);
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus kuis ini?')) {
      deleteQuiz(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
            Kuis
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            {quizzes.length} kuis terjadwal
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          <Plus className="w-5 h-5" />
          Tambah Kuis
        </button>
      </div>

      {/* Quizzes List */}
      <div className="grid gap-4">
        <AnimatePresence>
          {sortedQuizzes.length > 0 ? (
            sortedQuizzes.map((quiz, index) => {
              const status = getQuizStatus(quiz.date);
              return (
                <motion.div
                  key={quiz.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-soft card-hover group"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl ${status.bg} flex items-center justify-center flex-shrink-0`}>
                      <HelpCircle className={`w-6 h-6 ${status.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg text-slate-900 dark:text-white">
                            {quiz.course}
                          </h3>
                          <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-slate-500 dark:text-slate-400">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {format(new Date(quiz.date), 'd MMMM yyyy', { locale: id })}
                            </span>
                          </div>
                          {quiz.material && (
                            <div className="flex items-start gap-2 mt-2">
                              <BookOpen className="w-4 h-4 text-slate-400 mt-0.5" />
                              <p className="text-sm text-slate-500 dark:text-slate-400">
                                {quiz.material}
                              </p>
                            </div>
                          )}
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${status.bg} ${status.color}`}>
                          {status.label}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleOpenModal(quiz)}
                        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                      >
                        <Edit2 className="w-4 h-4 text-slate-500" />
                      </button>
                      <button
                        onClick={() => handleDelete(quiz.id)}
                        className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-12 shadow-soft text-center"
            >
              <HelpCircle className="w-16 h-16 mx-auto mb-4 text-slate-300 dark:text-slate-600" />
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                Belum ada kuis
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mb-4">
                Tambahkan jadwal kuis pertama Anda
              </p>
              <button
                onClick={() => handleOpenModal()}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                <Plus className="w-5 h-5" />
                Tambah Kuis
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingQuiz ? 'Edit Kuis' : 'Tambah Kuis'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Mata Kuliah
            </label>
            <input
              type="text"
              value={formData.course}
              onChange={(e) => setFormData({ ...formData, course: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Contoh: Bahasa Inggris"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Tanggal Kuis
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Materi / Topik
            </label>
            <textarea
              value={formData.material}
              onChange={(e) => setFormData({ ...formData, material: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              rows={3}
              placeholder="Contoh: Grammar tenses, Vocabulary chapters 1-3"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleCloseModal}
              className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              {editingQuiz ? 'Simpan' : 'Tambah'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

