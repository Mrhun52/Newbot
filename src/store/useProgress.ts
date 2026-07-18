import { create } from 'zustand';

interface ProgressState {
  isOpen: boolean;
  title: string;
  subtitle: string;
  progress: number;
  statusText: string;
  showProgress: (title: string, subtitle: string) => void;
  updateProgress: (progress: number, statusText: string) => void;
  hideProgress: () => void;
  runWithProgress: (
    title: string,
    subtitle: string,
    action: () => Promise<any>,
    options?: {
      steps?: { progress: number; text: string }[];
      durationMs?: number;
    }
  ) => Promise<any>;
}

export const useProgress = create<ProgressState>((set, get) => ({
  isOpen: false,
  title: '',
  subtitle: '',
  progress: 0,
  statusText: '',
  showProgress: (title, subtitle) => set({ isOpen: true, title, subtitle, progress: 0, statusText: 'Initializing...' }),
  updateProgress: (progress, statusText) => set({ progress, statusText }),
  hideProgress: () => set({ isOpen: false, progress: 0, statusText: '' }),
  runWithProgress: async (title, subtitle, action, options = {}) => {
    const { showProgress, updateProgress, hideProgress } = get();
    
    // Default simulated steps if none provided
    const steps = options.steps || [
      { progress: 10, text: 'Connecting to server...' },
      { progress: 30, text: 'Authenticating...' },
      { progress: 50, text: 'Processing request...' },
      { progress: 75, text: 'Applying changes...' },
      { progress: 90, text: 'Finalizing...' },
    ];
    
    const durationMs = options.durationMs || 2500;
    const stepDuration = durationMs / steps.length;
    
    showProgress(title, subtitle);
    
    let isFinished = false;
    
    // Start fake progress
    const progressPromise = (async () => {
      for (const step of steps) {
        if (isFinished) break;
        updateProgress(step.progress, step.text);
        await new Promise(r => setTimeout(r, stepDuration));
      }
    })();
    
    try {
      // Actually run the real action
      const result = await action();
      isFinished = true;
      updateProgress(100, 'Success!');
      await new Promise(r => setTimeout(r, 500)); // Briefly show 100%
      return result;
    } catch (e) {
      isFinished = true;
      updateProgress(100, 'Failed.');
      await new Promise(r => setTimeout(r, 500));
      throw e;
    } finally {
      hideProgress();
    }
  }
}));
