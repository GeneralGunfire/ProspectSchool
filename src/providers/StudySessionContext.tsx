/**
 * StudySessionContext
 *
 * Provides the currently logged-in student's identity to the study library
 * pages so they can save/load progress against our custom auth (student_id)
 * instead of Supabase Auth.
 *
 * Set this context in the student portal before rendering any learning page.
 * Learning pages read from it via useStudySession().
 */

import { createContext, useContext, type ReactNode } from 'react';

export interface StudySessionData {
  student_id: number;
  school_id: number;
}

const StudySessionContext = createContext<StudySessionData | null>(null);

export function StudySessionProvider({
  value,
  children,
}: {
  value: StudySessionData;
  children: ReactNode;
}) {
  return (
    <StudySessionContext.Provider value={value}>
      {children}
    </StudySessionContext.Provider>
  );
}

export function useStudySession(): StudySessionData | null {
  return useContext(StudySessionContext);
}
