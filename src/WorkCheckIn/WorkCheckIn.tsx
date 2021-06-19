import { Button, Container, Text } from '@chakra-ui/react';
import React, { ReactElement, useContext } from 'react';
import WorkContext from '../context/WorkContext';

export default function WorkCheckIn(): ReactElement {
  const {
    startWork,
    stopWork,
    pauseWork,
    resumeWork,
    formatTime,
    workTime,
    completedWorkTime,
    pausedWorkTime,
    isPaused,
  } = useContext(WorkContext);

  const formattedWorkTime = formatTime?.(workTime);
  const formattedCompletedWorkTime = completedWorkTime
    ? formatTime?.(completedWorkTime)
    : '';
  const formattedPausedWorkTime = pausedWorkTime
    ? formatTime?.(pausedWorkTime)
    : '';
  const startStopButtonAction = workTime ? stopWork : startWork;
  const startStopButtonText = workTime ? 'Stop work' : 'Start work';
  const pauseResumeButtonAction = isPaused ? resumeWork : pauseWork;
  const pauseResumeButtonText = isPaused ? 'Resume work' : 'Pause work';

  return (
    <Container>
      <Text>Time worked: {formattedWorkTime}</Text>
      <Text>Paused work time: {formattedPausedWorkTime}</Text>
      <Text>Completed work time: {formattedCompletedWorkTime}</Text>
      <Button onClick={startStopButtonAction}>{startStopButtonText}</Button>
      <Button onClick={pauseResumeButtonAction}>{pauseResumeButtonText}</Button>
    </Container>
  );
}
