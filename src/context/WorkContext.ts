import { createContext } from 'react';

interface IWorkContext {
  workTime: number;
  completedWorkTime: number;
  startWork?: () => void;
  stopWork?: () => void;
  formatTime?: (time?: number) => string;
}

const workContext = createContext<IWorkContext>({
  completedWorkTime: 0,
  workTime: 0,
});

export default workContext;
