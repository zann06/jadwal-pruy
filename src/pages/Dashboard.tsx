import { motion } from 'framer-motion';
import { format, isToday, isTomorrow, differenceInDays, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { id } from 'date-fns/locale';
import { useUser } from '../context/UserContext';
import { 
  ClipboardList, 
  FileText, 
  HelpCircle, 
  Calendar,
  Clock,
  ChevronRight,
  AlertTriangle,
  User
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { Link } from 'react-router-dom';

const courseColors = [
  '#6366F1', '#22C55E', '#F59E0B', '#EF4444', '#8B5CF6', 
  '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#14B8A6'
];

export default function Dashboard() {
  const { userName } = useUser();
  const { schedules, assignments, exams, quizzes, getTodaySchedules, getUpcomingAssignments } = useData();
  
  const todaySchedules = getTodaySchedules();
  const upcomingAssignments = getUpcomingAssignments();
  
  // Stats
  const activeAssignments = assignments.filter(a => !a.completed).length;
  const upcomingExams = exams.filter(e => new Date(e.date) >= new Date()).length;
  const upcomingQuizzes = quizzes.filter(q => new Date(q.date) >= new Date()).length;
  const todayScheduleCount = todaySchedules.length;

  // Weekly progress
  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });
  
  const completedThisWeek = assignments.filter(a => {
    const created = new Date(a.createdAt);
    return a.completed && created >= weekStart && created <= weekEnd;
  }).length;
  
  const totalAssignments = assignments.filter(a => {
    const deadline = new Date(a.deadline);
    return deadline >= weekStart && deadline <= weekEnd;
  }).length;
  
  const progressPercent = totalAssignments > 0 ? Math.round((completedThisWeek / totalAssignments) * 100) : 0;

  // Mini calendar
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const getDeadlineStatus = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const daysUntil = differenceInDays(deadlineDate, now);
    
    if (daysUntil <= 1) return { color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20', label: 'Mendesak' };
    if (daysUntil <= 3) return { color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20', label: 'Segera' };
    return { color: 'text-slate-500', bg: 'bg-slate-50 dark:bg-slate-800', label: 'Normal' };
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Welcome Header */}
      <motion.div variants={item} className="mb-8">
        <div className="bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 rounded-3xl p-6 text-white shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
              <User className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                Halo, {userName || 'Mahasiswa'}! 👋
              </h1>
              <p className="text-white/80 mt-1">
                {format(now, "EEEE, d MMMM yyyy", { locale: id })}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          icon={ClipboardList} 
          label="Tugas Aktif" 
          value={activeAssignments} 
          color="primary"
          link="/tugas"
        />
        <StatCard 
          icon={FileText} 
          label="Ujian" 
          value={upcomingExams} 
          color="amber"
          link="/ujian"
        />
        <StatCard 
          icon={HelpCircle} 
          label="Kuis" 
          value={upcomingQuizzes} 
          color="green"
          link="/kuis"
        />
        <StatCard 
          icon={Calendar} 
          label="Jadwal Hari Ini" 
          value={todayScheduleCount} 
          color="purple"
          link="/jadwal"
        />
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - 2/3 */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Schedule */}
          <motion.div variants={item} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Jadwal Hari Ini
              </h2>
              <Link to="/jadwal" className="text-sm text-primary hover:underline flex items-center gap-1">
                Lihat Semua <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            
            {todaySchedules.length > 0 ? (
              <div className="space-y-3">
                {todaySchedules.slice(0, 4).map((schedule, index) => (
                  <motion.div
                    key={schedule.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50"
                  >
                    <div 
                      className="w-1 h-12 rounded-full"
                      style={{ backgroundColor: schedule.color || courseColors[index % courseColors.length] }}
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-slate-900 dark:text-white">{schedule.course}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {schedule.startTime} - {schedule.endTime} • {schedule.room}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Tidak ada jadwal hari ini</p>
                <Link to="/jadwal" className="text-primary hover:underline text-sm">
                  Tambahkan jadwal
                </Link>
              </div>
            )}
          </motion.div>

          {/* Weekly Progress */}
          <motion.div variants={item} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-soft">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Progress Mingguan
            </h2>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1 h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-primary to-indigo-400 rounded-full"
                />
              </div>
              <span className="text-lg font-bold text-primary">{progressPercent}%</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-slate-500 dark:text-slate-400">
                {completedThisWeek} tugas selesai
              </span>
              <span className="text-slate-500 dark:text-slate-400">
                dari {totalAssignments} tugas minggu ini
              </span>
            </div>

            {/* Week Days */}
            <div className="flex justify-between mt-4">
              {weekDays.map((day, index) => {
                const dayName = format(day, 'EEE', { locale: id });
                const isCurrentDay = isToday(day);
                return (
                  <div 
                    key={index} 
                    className={`flex flex-col items-center ${isCurrentDay ? 'text-primary' : 'text-slate-400 dark:text-slate-500'}`}
                  >
                    <span className="text-xs">{dayName}</span>
                    <div className={`w-8 h-8 mt-1 rounded-full flex items-center justify-center ${isCurrentDay ? 'bg-primary/20' : ''}`}>
                      <span className="text-sm font-medium">{format(day, 'd')}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Right Column - 1/3 */}
        <div className="space-y-6">
          {/* Mini Calendar */}
          <motion.div variants={item} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-soft">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              {format(now, 'MMMM yyyy', { locale: id })}
            </h2>
            
            <div className="grid grid-cols-7 gap-1 text-center">
              {['S', 'S', 'R', 'K', 'J', 'S', 'M'].map((day, i) => (
                <span key={i} className="text-xs font-medium text-slate-400 dark:text-slate-500">{day}</span>
              ))}
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const isCurrentDay = now.getDate() === day;
                return (
                  <div 
                    key={day}
                    className={`p-2 text-sm rounded-lg ${
                      isCurrentDay 
                        ? 'bg-primary text-white font-bold' 
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Upcoming Deadlines */}
          <motion.div variants={item} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-soft">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Deadline Mendatang
            </h2>
            
            {upcomingAssignments.length > 0 ? (
              <div className="space-y-3">
                {upcomingAssignments.slice(0, 4).map((assignment) => {
                  const status = getDeadlineStatus(assignment.deadline);
                  return (
                    <div 
                      key={assignment.id}
                      className={`p-3 rounded-xl ${status.bg}`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium text-slate-900 dark:text-white text-sm">
                            {assignment.name}
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            {assignment.course}
                          </p>
                        </div>
                        <span className={`text-xs font-medium ${status.color}`}>
                          {isToday(new Date(assignment.deadline)) 
                            ? 'Hari ini' 
                            : isTomorrow(new Date(assignment.deadline))
                              ? 'Besok'
                              : format(new Date(assignment.deadline), 'd MMM', { locale: id })}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">
                Tidak ada deadline mendatang
              </p>
            )}
            
            <Link 
              to="/tugas" 
              className="block text-center text-sm text-primary hover:underline mt-4"
            >
              Lihat semua tugas
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  color: 'primary' | 'amber' | 'green' | 'purple';
  link: string;
}

function StatCard({ icon: Icon, label, value, color, link }: StatCardProps) {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary',
    amber: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
    green: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  };

  return (
    <Link to={link} className="block">
      <motion.div 
        whileHover={{ y: -2 }}
        className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-soft card-hover"
      >
        <div className={`w-10 h-10 rounded-xl ${colorClasses[color]} flex items-center justify-center mb-3`}>
          <Icon className="w-5 h-5" />
        </div>
        <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      </motion.div>
    </Link>
  );
}

