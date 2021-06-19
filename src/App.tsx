import React, { useState } from 'react';
import { ipcRenderer } from 'electron';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.global.css';
import Dashboard from './Dashboard/Dashboard';
import WorkContext from './context/WorkContext';

export default function App() {
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
    const minutes = `0${Math.floor(workTime / 60) % 60}`.slice(-2);
    const hours = `0${Math.floor(workTime / 3600)}`.slice(-2);

    return `${hours}:${minutes}:${seconds}`;
  }

  return (
    <WorkContext.Provider
      value={{
        startWork,
        stopWork,
        pauseWork,
        resumeWork,
        workTime,
        formatTime,
        completedWorkTime,
        pausedWorkTime,
        isPaused,
      }}
    >
      <Router>
        <Switch>
          <Route path="/" component={Dashboard} />
        </Switch>
      </Router>
    </WorkContext.Provider>
  );
}
