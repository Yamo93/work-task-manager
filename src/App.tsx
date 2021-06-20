import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.global.css';
import Dashboard from './Dashboard/Dashboard';
import WorkContext from './context/WorkContext';
import useTimer from './hooks/useTimer';
import LocalStorageService from './services/LocalStorageService';

export default function App() {
  const timeProperties = useTimer(LocalStorageService.getStartWorkTime());

  return (
    <WorkContext.Provider value={{ ...timeProperties }}>
      <Router>
        <Switch>
          <Route path="/" component={Dashboard} />
        </Switch>
      </Router>
    </WorkContext.Provider>
  );
}
