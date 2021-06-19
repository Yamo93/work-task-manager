import React, { useState } from 'react';
import { ipcRenderer } from 'electron';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.global.css';
import Dashboard from './Dashboard/Dashboard';
import WorkContext from './context/WorkContext';

export default function App() {
  const [workTime, setWorkTime] = useState(0);
  const [completedWorkTime, setCompletedWorkTime] = useState(0);
  const [intervalId, setIntervalId] = useState(0);

  function startWork(): void {
    ipcRenderer.send('start-work');
    const interval = window.setInterval(() => {
      setWorkTime((previousWorkTime) => previousWorkTime + 1);
    }, 1000);
    setIntervalId(interval);
  }

  function stopWork(): void {
    ipcRenderer.send('stop-work');
    setCompletedWorkTime(workTime);
    window.clearInterval(intervalId);
    setWorkTime(0);
  }

  function formatTime(time: number = workTime): string {
    const seconds = `0${time % 60}`.slice(-2);
    const minutes = `0${Math.floor(workTime / 60) % 60}`.slice(-2);
    const hours = `0${Math.floor(workTime / 3600)}`.slice(-2);

    return `${hours}:${minutes}:${seconds}`;
  }

  return (
    <WorkContext.Provider
      value={{ startWork, stopWork, workTime, formatTime, completedWorkTime }}
    >
      <Router>
        <Switch>
          <Route path="/" component={Dashboard} />
        </Switch>
      </Router>
    </WorkContext.Provider>
  );
}
