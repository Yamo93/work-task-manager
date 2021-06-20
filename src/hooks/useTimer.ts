import { ipcRenderer } from 'electron';
import { useEffect, useState } from 'react';
import { IWorkContext } from '../context/WorkContext';
import LocalStorageService from '../services/LocalStorageService';

type HookResult = IWorkContext;

export default function useTimer(storedWorkTime: number): HookResult {
  const [workTime, setWorkTime] = useState(storedWorkTime);
  const [completedWorkTime, setCompletedWorkTime] = useState(0);
  const [pausedWorkTime, setPausedWorkTime] = useState(0);
  const [intervalId, setIntervalId] = useState(0);
  const [pauseIntervalId, setPauseIntervalId] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  function stopWorkTimer(): void {
    window.clearInterval(intervalId);
  }

  function clearWorkTime(): void {
    setWorkTime(0);
    LocalStorageService.clearWorkTime();
  }

  function startPauseTimer(): void {
    const pauseInterval = window.setInterval(() => {
      setPausedWorkTime((previousPausedWorkTime) => previousPausedWorkTime + 1);
    }, 1000);
    setPauseIntervalId(pauseInterval);
    setIsPaused(true);
  }

  function stopPauseTimer(): void {
    window.clearInterval(pauseIntervalId);
    setIsPaused(false);
  }

  function startWorkTimer(): void {
    stopWorkTimer();
    const interval = window.setInterval(() => {
      setWorkTime((previousWorkTime) => previousWorkTime + 1);
    }, 1000);
    setIntervalId(interval);
  }

  function startWork(): void {
    const now = LocalStorageService.storeStartWorkTime();
    ipcRenderer.send('start-work', now);
    startWorkTimer();
  }

  function stopWork(): void {
    ipcRenderer.send('stop-work');
    setCompletedWorkTime(workTime);
    stopWorkTimer();
    clearWorkTime();
    stopPauseTimer();
  }

  function pauseWork(): void {
    stopWorkTimer();
    startPauseTimer();
  }

  function resumeWork(): void {
    stopPauseTimer();
    startWorkTimer();
  }

  function formatTime(time: number = workTime): string {
    const seconds = `0${time % 60}`.slice(-2);
    const minutes = `0${Math.floor(time / 60) % 60}`.slice(-2);
    const hours = `0${Math.floor(time / 3600)}`.slice(-2);

    return `${hours}:${minutes}:${seconds}`;
  }

  useEffect(() => {
    if (!isPaused && storedWorkTime) {
      startWorkTimer();
    }

    return (): void => {
      window.clearInterval(intervalId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storedWorkTime]);

  return {
    startWork,
    stopWork,
    pauseWork,
    resumeWork,
    workTime,
    formatTime,
    completedWorkTime,
    pausedWorkTime,
    isPaused,
  };
}
