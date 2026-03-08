import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Plus, Edit2, Trash2, MapPin, Clock, BookOpen, X } from 'lucide-react';
import { useData } from '../context/DataContext';
import { Schedule as ScheduleType, DayOfWeek } from '../types';
import Modal from '../components/Modal';

const days: { key: DayOfWeek; label: string }[] = [
  { key: 'monday', label: 'Senin' },
  { key: 'tuesday', label: 'Selasa' },
  { key: 'wednesday', label: 'Rabu' },
  { key: 'thursday', label: 'Kamis' },
  { key: 'friday', label: 'Jumat' },
  { key: 'saturday', label: 'Sabtu' },
  { key: 'sunday', label: 'Minggu' },
];

const courseColors = [
  '#6366F1', '#22C55E', '#F59E0B', '#EF4444', '#8B5CF6', 
  '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#14B8A6'
];

export default function Schedule() {
  const { schedules, addSchedule, updateSchedule, deleteSchedule } = useData();
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('monday');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<ScheduleType | null>(null);
  const [formData, setFormData] = useState({
    course: '',
    startTime: '08:00',
    endTime: '09:30',
    room: '',
    notes: '',
    color: courseColors[0],
  });

  const today = new Date();
  const daysWithDate = days.map(d => {
    const dayIndex = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].indexOf(d.key);
    const diff = (dayIndex - today.getDay() + 7) % 7;
    const date = new Date(today);
    date.setDate(today.getDate() + diff);
    return { ...d, date };
  });

  const getSchedulesForDay = (day: DayOfWeek) => {
    return schedules
      .filter(s => s.day === day)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  const handleOpenModal = (schedule?: ScheduleType) => {
    if (schedule) {
      setEditingSchedule(schedule);
      setFormData({
        course: schedule.course,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        room: schedule.room,
        notes: schedule.notes,
        color: schedule.color,
      });
    } else {
      setEditingSchedule(null);
      setFormData({
        course: '',
        startTime: '08:00',
        endTime: '09:30',
        room: '',
        notes: '',
        color: courseColors[Math.floor(Math.random() * courseColors.length)],
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSchedule(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSchedule) {
      updateSchedule(editingSchedule.id, { ...formData, day: selectedDay });
    } else {
      addSchedule({ ...formData, day: selectedDay });
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus jadwal ini?')) {
      deleteSchedule(id);
    }
  };

  const selectedDaySchedules = getSchedulesForDay(selectedDay);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
            Jadwal Mingguan
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Kelola jadwal kuliahmu
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          <Plus className="w-5 h-5" />
          Tambah Jadwal
        </button>
      </div>

      {/* Day Tabs */}
      <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
        {daysWithDate.map((day) => (
          <button
            key={day.key}
            onClick={() => setSelectedDay(day.key)}
            className={`flex-shrink-0 px-4 py-3 rounded-xl transition-all ${
              selectedDay === day.key
                ? 'bg-primary text-white shadow-lg'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <div className="text-sm font-medium">{day.label}</div>
            <div className="text-xs opacity-75">{format(day.date, 'd MMM', { locale: id })}</div>
          </button>
        ))}
      </div>

      {/* Schedule List */}
      <div className="grid gap-4">
        <AnimatePresence mode="wait">
          {selectedDaySchedules.length > 0 ? (
            selectedDaySchedules.map((schedule, index) => (
              <motion.div
                key={schedule.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-soft card-hover group"
              >
                <div className="flex items-start gap-4">
                  <div 
                    className="w-1 h-full min-h-[80px] rounded-full"
                    style={{ backgroundColor: schedule.color }}
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg text-slate-900 dark:text-white">
                          {schedule.course}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-slate-500 dark:text-slate-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {schedule.startTime} - {schedule.endTime}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {schedule.room || 'Tidak ada ruangan'}
                          </span>
                        </div>
                        {schedule.notes && (
                          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                            {schedule.notes}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleOpenModal(schedule)}
                          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        >
                          <Edit2 className="w-4 h-4 text-slate-500" />
                        </button>
                        <button
                          onClick={() => handleDelete(schedule.id)}
                          className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-12 shadow-soft text-center"
            >
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-slate-300 dark:text-slate-600" />
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                Tidak ada jadwal
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mb-4">
                Tambahkan jadwal untuk hari {days.find(d => d.key === selectedDay)?.label}
              </p>
              <button
                onClick={() => handleOpenModal()}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                <Plus className="w-5 h-5" />
                Tambah Jadwal
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingSchedule ? 'Edit Jadwal' : 'Tambah Jadwal'}
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
              placeholder="Contoh: Algoritma & Struktur Data"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Jam Mulai
              </label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Jam Selesai
              </label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Ruangan
            </label>
            <input
              type="text"
              value={formData.room}
              onChange={(e) => setFormData({ ...formData, room: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Contoh: Ruang 301"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Catatan
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              rows={2}
              placeholder="Opsional..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Warna
            </label>
            <div className="flex gap-2 flex-wrap">
              {courseColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({ ...formData, color })}
                  className={`w-8 h-8 rounded-full transition-transform ${
                    formData.color === color ? 'scale-110 ring-2 ring-offset-2 ring-primary' : ''
                  }`}
                  style={{ backgroundColor: color }}
                />
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
              {editingSchedule ? 'Simpan' : 'Tambah'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

