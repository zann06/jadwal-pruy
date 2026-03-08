import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Schedule, Assignment, Exam, Quiz, DayOfWeek, AppData } from '../types';

interface DataContextType {
  // Schedules
  schedules: Schedule[];
  addSchedule: (schedule: Omit<Schedule, 'id'>) => void;
  updateSchedule: (id: string, schedule: Partial<Schedule>) => void;
  deleteSchedule: (id: string) => void;
  
  // Assignments
  assignments: Assignment[];
  addAssignment: (assignment: Omit<Assignment, 'id' | 'createdAt'>) => void;
  updateAssignment: (id: string, assignment: Partial<Assignment>) => void;
  deleteAssignment: (id: string) => void;
  toggleAssignment: (id: string) => void;
  
  // Exams
  exams: Exam[];
  addExam: (exam: Omit<Exam, 'id'>) => void;
  updateExam: (id: string, exam: Partial<Exam>) => void;
  deleteExam: (id: string) => void;
  
  // Quizzes
  quizzes: Quiz[];
  addQuiz: (quiz: Omit<Quiz, 'id'>) => void;
  updateQuiz: (id: string, quiz: Partial<Quiz>) => void;
  deleteQuiz: (id: string) => void;
  
  // Utils
  resetData: () => void;
  exportData: () => string;
  getTodaySchedules: () => Schedule[];
  getUpcomingAssignments: () => Assignment[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const STORAGE_KEY = 'jadwal-pruy-data';

const defaultData = {
  schedules: [] as Schedule[],
  assignments: [] as Assignment[],
  exams: [] as Exam[],
  quizzes: [] as Quiz[],
};

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return defaultData;
      }
    }
    return defaultData;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  // Schedules
  const addSchedule = useCallback((schedule: Omit<Schedule, 'id'>) => {
    setData((prev: AppData) => ({
      ...prev,
      schedules: [...prev.schedules, { ...schedule, id: uuidv4() }],
    }));
  }, []);

  const updateSchedule = useCallback((id: string, schedule: Partial<Schedule>) => {
    setData((prev: AppData) => ({
      ...prev,
      schedules: prev.schedules.map((s: Schedule) => s.id === id ? { ...s, ...schedule } : s),
    }));
  }, []);

  const deleteSchedule = useCallback((id: string) => {
    setData((prev: AppData) => ({
      ...prev,
      schedules: prev.schedules.filter((s: Schedule) => s.id !== id),
    }));
  }, []);

  // Assignments
  const addAssignment = useCallback((assignment: Omit<Assignment, 'id' | 'createdAt'>) => {
    setData((prev: AppData) => ({
      ...prev,
      assignments: [...prev.assignments, { 
        ...assignment, 
        id: uuidv4(),
        createdAt: new Date().toISOString(),
      }],
    }));
  }, []);

  const updateAssignment = useCallback((id: string, assignment: Partial<Assignment>) => {
    setData((prev: AppData) => ({
      ...prev,
      assignments: prev.assignments.map((a: Assignment) => a.id === id ? { ...a, ...assignment } : a),
    }));
  }, []);

  const deleteAssignment = useCallback((id: string) => {
    setData((prev: AppData) => ({
      ...prev,
      assignments: prev.assignments.filter((a: Assignment) => a.id !== id),
    }));
  }, []);

  const toggleAssignment = useCallback((id: string) => {
    setData((prev: AppData) => ({
      ...prev,
      assignments: prev.assignments.map((a: Assignment) => 
        a.id === id ? { ...a, completed: !a.completed } : a
      ),
    }));
  }, []);

  // Exams
  const addExam = useCallback((exam: Omit<Exam, 'id'>) => {
    setData((prev: AppData) => ({
      ...prev,
      exams: [...prev.exams, { ...exam, id: uuidv4() }],
    }));
  }, []);

  const updateExam = useCallback((id: string, exam: Partial<Exam>) => {
    setData((prev: AppData) => ({
      ...prev,
      exams: prev.exams.map((e: Exam) => e.id === id ? { ...e, ...exam } : e),
    }));
  }, []);

  const deleteExam = useCallback((id: string) => {
    setData((prev: AppData) => ({
      ...prev,
      exams: prev.exams.filter((e: Exam) => e.id !== id),
    }));
  }, []);

  // Quizzes
  const addQuiz = useCallback((quiz: Omit<Quiz, 'id'>) => {
    setData((prev: AppData) => ({
      ...prev,
      quizzes: [...prev.quizzes, { ...quiz, id: uuidv4() }],
    }));
  }, []);

  const updateQuiz = useCallback((id: string, quiz: Partial<Quiz>) => {
    setData((prev: AppData) => ({
      ...prev,
      quizzes: prev.quizzes.map((q: Quiz) => q.id === id ? { ...q, ...quiz } : q),
    }));
  }, []);

  const deleteQuiz = useCallback((id: string) => {
    setData((prev: AppData) => ({
      ...prev,
      quizzes: prev.quizzes.filter((q: Quiz) => q.id !== id),
    }));
  }, []);

  // Utils
  const resetData = useCallback(() => {
    setData(defaultData);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const exportData = useCallback(() => {
    return JSON.stringify(data, null, 2);
  }, [data]);

  const getTodaySchedules = useCallback(() => {
    const days: DayOfWeek[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const today = days[new Date().getDay()];
    return data.schedules.filter((s: Schedule) => s.day === today).sort((a: Schedule, b: Schedule) => a.startTime.localeCompare(b.startTime));
  }, [data.schedules]);

  const getUpcomingAssignments = useCallback(() => {
    const now = new Date();
    return data.assignments
      .filter((a: Assignment) => !a.completed && new Date(a.deadline) >= now)
      .sort((a: Assignment, b: Assignment) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
      .slice(0, 5);
  }, [data.assignments]);

  return (
    <DataContext.Provider value={{
      schedules: data.schedules,
      addSchedule,
      updateSchedule,
      deleteSchedule,
      assignments: data.assignments,
      addAssignment,
      updateAssignment,
      deleteAssignment,
      toggleAssignment,
      exams: data.exams,
      addExam,
      updateExam,
      deleteExam,
      quizzes: data.quizzes,
      addQuiz,
      updateQuiz,
      deleteQuiz,
      resetData,
      exportData,
      getTodaySchedules,
      getUpcomingAssignments,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}

