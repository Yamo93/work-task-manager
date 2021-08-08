import { createContext } from 'react';

export interface IWorkContext {
  workTime: number;
  completedWorkTime: number;
  completedPauseTime: number;
  pausedWorkTime: number;
  startWork?: () => void;
  stopWork?: () => void;
  abortWork?: () => void;
  pauseWork?: () => void;
  resumeWork?: () => void;
  formatTime?: (time?: number) => string;
  isPausing: boolean;
  appendWorkTime?: (appendedWorkTimeInMinutes: number, withdrawFromPauseTime: boolean) => void;
  appendPauseTime?: (appendedPauseTimeInMinutes: number, withdrawFromWorkTime: boolean) => void;
}

const workContext = createContext<IWorkContext>({
  workTime: 0,
  completedWorkTime: 0,
  completedPauseTime: 0,
  pausedWorkTime: 0,
  isPausing: false,
});

export default workContext;
