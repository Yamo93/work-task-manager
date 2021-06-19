import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.global.css';
import Dashboard from './Dashboard/Dashboard';
import WorkContext from './context/WorkContext';
import useTimer from './hooks/useTimer';

export default function App() {
  const {
    startWork,
    stopWork,
    pauseWork,
    resumeWork,
    workTime,
    formatTime,
    completedWorkTime,
    pausedWorkTime,
    isPaused,
  } = useTimer();

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
