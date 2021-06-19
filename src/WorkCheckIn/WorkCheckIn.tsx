import { Button, Container, Text } from '@chakra-ui/react';
import React, { ReactElement, useContext } from 'react';
import WorkContext from '../context/WorkContext';

export default function WorkCheckIn(): ReactElement {
  const {
    startWork,
    stopWork,
    formatTime,
    workTime,
    completedWorkTime,
  } = useContext(WorkContext);

  const formattedWorkTime = formatTime?.(workTime);
  const formattedCompletedWorkTime = completedWorkTime
    ? formatTime?.(completedWorkTime)
    : '';
  const buttonAction = workTime ? stopWork : startWork;
  const buttonText = workTime ? 'Stop work' : 'Start work';

  return (
    <Container>
      <Text>Time worked: {formattedWorkTime}</Text>
      <Text>Completed work time: {formattedCompletedWorkTime}</Text>
      <Button onClick={buttonAction}>{buttonText}</Button>
    </Container>
  );
}
