import { createContext } from 'react';

export interface IWorkContext {
  workTime: number;
  completedWorkTime: number;
  pausedWorkTime: number;
  startWork?: () => void;
  stopWork?: () => void;
  pauseWork?: () => void;
  resumeWork?: () => void;
  formatTime?: (time?: number) => string;
  isPaused: boolean;
}

const workContext = createContext<IWorkContext>({
  workTime: 0,
  completedWorkTime: 0,
  pausedWorkTime: 0,
  isPaused: false,
});

export default workContext;
