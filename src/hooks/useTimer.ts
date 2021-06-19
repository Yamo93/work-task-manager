import { ipcRenderer } from 'electron';
import { useState } from 'react';
import { IWorkContext } from '../context/WorkContext';

type HookResult = IWorkContext;

export default function useTimer(): HookResult {
  const [workTime, setWorkTime] = useState(0);
  const [completedWorkTime, setCompletedWorkTime] = useState(0);
  const [pausedWorkTime, setPausedWorkTime] = useState(0);
  const [intervalId, setIntervalId] = useState(0);
  const [pauseIntervalId, setPauseIntervalId] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  function startWorkTimer(): void {
    const interval = window.setInterval(() => {
      setWorkTime((previousWorkTime) => previousWorkTime + 1);
    }, 1000);
    setIntervalId(interval);
  }

  function stopWorkTimer(): void {
    window.clearInterval(intervalId);
  }

  function clearWorkTime(): void {
    setWorkTime(0);
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

  function startWork(): void {
    ipcRenderer.send('start-work');
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
