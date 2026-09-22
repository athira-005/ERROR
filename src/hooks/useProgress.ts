import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export interface ModuleProgress {
  device_id: string;
  module: string;
  completed: boolean;
  score: number;
}

export interface QuizResult {
  id: string;
  device_id: string;
  score: number;
  total_questions: number;
  correct_answers: number;
  created_at: string;
}

export interface Favorite {
  device_id: string;
}

export interface RecentAccess {
  device_id: string;
  module: string;
  accessed_at: string;
}

export interface Certificate {
  id: string;
  device_id: string;
  certificate_type: string;
  created_at: string;
}

export function useProgress() {
  const [progress, setProgress] = useState<ModuleProgress[]>([]);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recentAccess, setRecentAccess] = useState<RecentAccess[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const [progRes, quizRes, favRes, recentRes, certRes] = await Promise.all([
      supabase.from('lab_progress').select('*'),
      supabase.from('quiz_results').select('*').order('created_at', { ascending: false }),
      supabase.from('favorites').select('*'),
      supabase.from('recent_access').select('*').order('accessed_at', { ascending: false }).limit(10),
      supabase.from('certificates').select('*').order('created_at', { ascending: false }),
    ]);

    if (progRes.data) setProgress(progRes.data as ModuleProgress[]);
    if (quizRes.data) setQuizResults(quizRes.data as QuizResult[]);
    if (favRes.data) setFavorites((favRes.data as Favorite[]).map((f) => f.device_id));
    if (recentRes.data) setRecentAccess(recentRes.data as RecentAccess[]);
    if (certRes.data) setCertificates(certRes.data as Certificate[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const markModuleComplete = useCallback(async (deviceId: string, module: string, score: number = 0) => {
    await supabase
      .from('lab_progress')
      .upsert({ device_id: deviceId, module, completed: true, score, updated_at: new Date().toISOString() }, { onConflict: 'device_id,module' });
    fetchAll();
  }, [fetchAll]);

  const saveQuizResult = useCallback(async (deviceId: string, score: number, total: number, correct: number) => {
    await supabase.from('quiz_results').insert({ device_id: deviceId, score, total_questions: total, correct_answers: correct });
    await supabase.from('lab_progress').upsert({ device_id: deviceId, module: 'quiz', completed: true, score, updated_at: new Date().toISOString() }, { onConflict: 'device_id,module' });
    fetchAll();
  }, [fetchAll]);

  const toggleFavorite = useCallback(async (deviceId: string) => {
    if (favorites.includes(deviceId)) {
      await supabase.from('favorites').delete().eq('device_id', deviceId);
    } else {
      await supabase.from('favorites').insert({ device_id: deviceId });
    }
    fetchAll();
  }, [favorites, fetchAll]);

  const recordAccess = useCallback(async (deviceId: string, module: string) => {
    await supabase.from('recent_access').insert({ device_id: deviceId, module, accessed_at: new Date().toISOString() });
    fetchAll();
  }, [fetchAll]);

  const awardCertificate = useCallback(async (deviceId: string, type: string) => {
    const exists = certificates.some((c) => c.device_id === deviceId && c.certificate_type === type);
    if (!exists) {
      await supabase.from('certificates').insert({ device_id: deviceId, certificate_type: type });
      fetchAll();
    }
  }, [certificates, fetchAll]);

  const isModuleComplete = useCallback((deviceId: string, module: string) => {
    return progress.some((p) => p.device_id === deviceId && p.module === module && p.completed);
  }, [progress]);

  const getDeviceProgress = useCallback((deviceId: string) => {
    const deviceModules = progress.filter((p) => p.device_id === deviceId);
    const total = 9;
    const completed = deviceModules.filter((p) => p.completed).length;
    return { completed, total, percentage: Math.round((completed / total) * 100) };
  }, [progress]);

  return {
    progress,
    quizResults,
    favorites,
    recentAccess,
    certificates,
    loading,
    markModuleComplete,
    saveQuizResult,
    toggleFavorite,
    recordAccess,
    awardCertificate,
    isModuleComplete,
    getDeviceProgress,
  };
}
