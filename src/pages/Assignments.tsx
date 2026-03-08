import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, isToday, isTomorrow, differenceInDays } from 'date-fns';
import { id } from 'date-fns/locale';
import { Plus, Edit2, Trash2, Check, X, AlertTriangle, Filter, Search } from 'lucide-react';
import { useData } from '../context/DataContext';
import { Assignment, Priority } from '../types';
import Modal from '../components/Modal';

const priorities: { key: Priority; label: string; color: string }[] = [
  { key: 'high', label: 'Tinggi', color: 'red' },
  { key: 'medium', label: 'Sedang', color: 'amber' },
  { key: 'low', label: 'Rendah', color: 'green' },
];

export default function Assignments() {
  const { assignments, addAssignment, updateAssignment, deleteAssignment, toggleAssignment } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    course: '',
    deadline: '',
    priority: 'medium' as Priority,
  });

  const filteredAssignments = assignments
    .filter(a => {
      if (filter === 'completed') return a.completed;
      if (filter === 'pending') return !a.completed;
      return true;
    })
    .filter(a => 
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.course.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    });

  const getDeadlineStatus = (deadline: string, completed: boolean) => {
    if (completed) return { color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20', border: 'border-green-200 dark:border-green-800' };
    
    const deadlineDate = new Date(deadline);
    const daysUntil = differenceInDays(deadlineDate, new Date());
    
    if (daysUntil <= 1) return { color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20', border: 'border-red-200 dark:border-red-800' };
    if (daysUntil <= 3) return { color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-200 dark:border-amber-800' };
    return { color: 'text-slate-500', bg: 'bg-slate-50 dark:bg-slate-800', border: 'border-slate-200 dark:border-slate-700' };
  };

  const getPriorityBadge = (priority: Priority) => {
    const p = priorities.find(pr => pr.key === priority);
    return p ? (
      <span className={`px-2 py-0.5 text-xs font-medium rounded-full priority-${priority}`}>
        {p.label}
      </span>
    ) : null;
  };

  const handleOpenModal = (assignment?: Assignment) => {
    if (assignment) {
      setEditingAssignment(assignment);
      setFormData({
        name: assignment.name,
        course: assignment.course,
        deadline: assignment.deadline.split('T')[0],
        priority: assignment.priority,
      });
    } else {
      setEditingAssignment(null);
      setFormData({
        name: '',
        course: '',
        deadline: '',
        priority: 'medium',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAssignment(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAssignment) {
      updateAssignment(editingAssignment.id, formData);
    } else {
      addAssignment({ ...formData, completed: false });
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus tugas ini?')) {
      deleteAssignment(id);
    }
  };

  const completedCount = assignments.filter(a => a.completed).length;
  const pendingCount = assignments.filter(a => !a.completed).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
            Tugas
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            {completedCount} selesai • {pendingCount} belum selesai
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          <Plus className="w-5 h-5" />
          Tambah Tugas
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Cari tugas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'pending', 'completed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === f
                  ? 'bg-primary text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {f === 'all' ? 'Semua' : f === 'pending' ? 'Belum' : 'Selesai'}
            </button>
          ))}
        </div>
      </div>

      {/* Assignments List */}
      <div className="grid gap-4">
        <AnimatePresence>
          {filteredAssignments.length > 0 ? (
            filteredAssignments.map((assignment, index) => {
              const status = getDeadlineStatus(assignment.deadline, assignment.completed);
              return (
                <motion.div
                  key={assignment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className={`bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-soft card-hover group border-l-4 ${
                    assignment.completed ? 'border-green-500' : status.border?.split(' ')[0].replace('border-', 'border-')
                  }`}
                  style={{ borderLeftColor: assignment.completed ? '#22C55E' : undefined }}
                >
                  <div className="flex items-start gap-4">
                    <button
                      onClick={() => toggleAssignment(assignment.id)}
                      className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                        assignment.completed
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'border-slate-300 dark:border-slate-600 hover:border-primary'
                      }`}
                    >
                      {assignment.completed && <Check className="w-4 h-4" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className={`font-medium text-lg ${
                            assignment.completed 
                              ? 'text-slate-400 dark:text-slate-500 line-through' 
                              : 'text-slate-900 dark:text-white'
                          }`}>
                            {assignment.name}
                          </h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                            {assignment.course}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getPriorityBadge(assignment.priority)}
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 mt-3 text-sm">
                        <span className={`flex items-center gap-1 ${status.color}`}>
                          <AlertTriangle className="w-4 h-4" />
                          {assignment.completed ? (
                            <span className="text-green-500">Selesai</span>
                          ) : isToday(new Date(assignment.deadline)) ? (
                            'Hari ini'
                          ) : isTomorrow(new Date(assignment.deadline)) ? (
                            'Besok'
                          ) : (
                            format(new Date(assignment.deadline), 'd MMM yyyy', { locale: id })
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleOpenModal(assignment)}
                        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                      >
                        <Edit2 className="w-4 h-4 text-slate-500" />
                      </button>
                      <button
                        onClick={() => handleDelete(assignment.id)}
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
              <Filter className="w-16 h-16 mx-auto mb-4 text-slate-300 dark:text-slate-600" />
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                {searchQuery ? 'Tugas tidak ditemukan' : 'Belum ada tugas'}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mb-4">
                {searchQuery ? 'Coba kata kunci lain' : 'Tambahkan tugas pertama Anda'}
              </p>
              {!searchQuery && (
                <button
                  onClick={() => handleOpenModal()}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Tambah Tugas
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingAssignment ? 'Edit Tugas' : 'Tambah Tugas'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Nama Tugas
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Contoh: TUGAS ALGORITMA"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Mata Kuliah
            </label>
            <input
              type="text"
              value={formData.course}
              onChange={(e) => setFormData({ ...formData, course: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Contoh: Algoritma & Struktur Data"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Deadline
            </label>
            <input
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Prioritas
            </label>
            <div className="flex gap-2">
              {priorities.map((p) => (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => setFormData({ ...formData, priority: p.key })}
                  className={`flex-1 px-4 py-2 rounded-lg border-2 transition-colors ${
                    formData.priority === p.key
                      ? `border-${p.color}-500 bg-${p.color}-50 dark:bg-${p.color}-900/20`
                      : 'border-slate-200 dark:border-slate-600 hover:border-slate-300'
                  }`}
                >
                  <span className={`text-sm font-medium text-${p.color}-600 dark:text-${p.color}-400`}>
                    {p.label}
                  </span>
                </button>
              ))}
            </div>
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
              {editingAssignment ? 'Simpan' : 'Tambah'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

