import { useEffect, useState } from 'react';
import { IWorkContext } from '../context/WorkContext';
import IpcService from '../services/IpcService';
import LocalStorageService from '../services/LocalStorageService';

type HookResult = IWorkContext;
type SetTime = (value: React.SetStateAction<number>) => void;

interface HookConfig {
  storedWorkTime: number;
  storedIsPausing: boolean;
  storedSecondsPaused: number;
}

export default function useTimer({
  storedWorkTime,
  storedIsPausing,
  storedSecondsPaused,
}: HookConfig): HookResult {
  const [workTime, setWorkTime] = useState(storedWorkTime);
  const [completedWorkTime, setCompletedWorkTime] = useState(0);
  const [completedPauseTime, setCompletedPauseTime] = useState(0);
  const [pausedWorkTime, setPausedWorkTime] = useState(storedSecondsPaused);
  const [intervalId, setIntervalId] = useState(0);
  const [pauseIntervalId, setPauseIntervalId] = useState(0);
  const [isPausing, setIsPausing] = useState(false);

  function stopWorkTimer(): void {
    window.clearInterval(intervalId);
  }

  function clearWorkTime(): void {
    setWorkTime(0);
    LocalStorageService.clearWorkTime();
    LocalStorageService.clearWorkedSeconds();
  }

  function clearPauseTime(): void {
    setPausedWorkTime(0);
    LocalStorageService.clearLatestPausedAt();
    LocalStorageService.clearIsPausing();
    LocalStorageService.clearSecondsPaused();
  }

  function startPauseTimer(): void {
    const pauseInterval = window.setInterval(() => {
      setPausedWorkTime((previousPausedWorkTime) => previousPausedWorkTime + 1);
    }, 1000);
    setPauseIntervalId(pauseInterval);
    setIsPausing(true);
  }

  function stopPauseTimer(): void {
    window.clearInterval(pauseIntervalId);
    setIsPausing(false);
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
    IpcService.emitStartWork(now);
    startWorkTimer();
  }

  function stopWork(): void {
    setCompletedWorkTime(workTime);
    setCompletedPauseTime(pausedWorkTime);
    IpcService.emitStopWork(workTime, pausedWorkTime);
    stopWorkTimer();
    clearWorkTime();
    stopPauseTimer();
    clearPauseTime();
  }

  function abortWork(): void {
    setCompletedWorkTime(0);
    setCompletedPauseTime(0);
    stopWorkTimer();
    clearWorkTime();
    stopPauseTimer();
    clearPauseTime();
  }

  function pauseWork(): void {
    stopWorkTimer();
    startPauseTimer();
    LocalStorageService.storeLatestPausedAt();
  }

  function resumeWork(): void {
    stopPauseTimer();
    startWorkTimer();
    LocalStorageService.storeSecondsPaused(pausedWorkTime);
  }

  function formatTime(time: number = workTime): string {
    const seconds = `0${time % 60}`.slice(-2);
    const minutes = `0${Math.floor(time / 60) % 60}`.slice(-2);
    const hours = `0${Math.floor(time / 3600)}`.slice(-2);

    return `${hours}:${minutes}:${seconds}`;
  }

  function appendTime(appendedTimeInMinutes: number, withdraw: boolean) {
    return (setTime: SetTime, withdrawFromTime: SetTime): void => {
      const appendedWorkTimeInSeconds = appendedTimeInMinutes * 60;
      setTime((previousWorkTimeInSeconds: number) => {
        return previousWorkTimeInSeconds + appendedWorkTimeInSeconds;
      });

      if (withdraw) {
        withdrawFromTime((previousPausedWorkTimeInSeconds: number) => {
          return previousPausedWorkTimeInSeconds - appendedWorkTimeInSeconds;
        });
      }
    };
  }

  function appendWorkTime(appendedWorkTimeInMinutes: number, withdrawFromPauseTime: boolean) {
    const append = appendTime(appendedWorkTimeInMinutes, withdrawFromPauseTime);
    append(setWorkTime, setPausedWorkTime);
  }

  function appendPauseTime(appendedPauseTimeInMinutes: number, withdrawFromWorkTime: boolean) {
    const append = appendTime(appendedPauseTimeInMinutes, withdrawFromWorkTime);
    append(setPausedWorkTime, setWorkTime);
  }

  useEffect(() => {
    if (!isPausing && !storedIsPausing && storedWorkTime) {
      startWorkTimer();
    }

    if (isPausing || storedIsPausing) {
      startPauseTimer();
    }

    return (): void => {
      window.clearInterval(intervalId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    LocalStorageService.storeIsPausing(isPausing);

    if (isPausing) {
      LocalStorageService.storeWorkedSeconds(workTime);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPausing]);

  return {
    startWork,
    stopWork,
    abortWork,
    pauseWork,
    resumeWork,
    workTime,
    formatTime,
    completedWorkTime,
    pausedWorkTime,
    isPausing,
    completedPauseTime,
    appendWorkTime,
    appendPauseTime,
  };
}
