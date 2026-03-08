export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export type Priority = 'low' | 'medium' | 'high';

export interface Schedule {
  id: string;
  day: DayOfWeek;
  course: string;
  startTime: string;
  endTime: string;
  room: string;
  notes: string;
  color: string;
}

export interface Assignment {
  id: string;
  name: string;
  course: string;
  deadline: string;
  priority: Priority;
  completed: boolean;
  createdAt: string;
}

export interface Exam {
  id: string;
  course: string;
  date: string;
  time: string;
  notes: string;
}

export interface Quiz {
  id: string;
  course: string;
  date: string;
  material: string;
}

export interface AppData {
  schedules: Schedule[];
  assignments: Assignment[];
  exams: Exam[];
  quizzes: Quiz[];
}

