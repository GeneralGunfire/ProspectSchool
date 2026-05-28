import { createContext, ReactNode } from 'react';

export interface ToastContextType {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const success = (message: string) => {
    console.log('[TOAST] Success:', message);
  };

  const error = (message: string) => {
    console.error('[TOAST] Error:', message);
  };

  const info = (message: string) => {
    console.info('[TOAST] Info:', message);
  };

  return (
    <ToastContext.Provider value={{ success, error, info }}>
      {children}
    </ToastContext.Provider>
  );
}
