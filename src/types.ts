export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  money?: number;
  coins?: number;
  carsCount?: number;
  unlockedFeatures?: string[];
}

export interface Car {
  id: string;
  model: string;
  name: string;
  unlocked: boolean;
  price: number;
}

export interface HistoryItem {
  id: string;
  action: string;
  status: 'success' | 'failed' | 'pending';
  time: string;
  result: string;
}

export interface AuthState {
  user: User | null;
  credentials: { email: string; password: string } | null;
  isAuthenticated: boolean;
  login: (credentials: any, user: User) => void;
  logout: () => void;
  lastActivity?: number;
  updateActivity?: () => void;
  checkActivity?: () => void;
  updateUser: (data: Partial<User>) => void;
}

export interface ToastState {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

export interface Toast {
  id: string;
  title: string;
  description?: string;
  type?: 'success' | 'error' | 'info' | 'warning';
}
