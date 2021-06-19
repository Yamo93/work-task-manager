import React, { ReactElement, useContext } from 'react';
import {
  Button,
  ButtonGroup,
  Container,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  StatGroup,
} from '@chakra-ui/react';

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
  const formattedCompletedWorkTime = formatTime?.(completedWorkTime);
  const formattedPausedWorkTime = formatTime?.(pausedWorkTime);
  const startStopButtonAction = workTime ? stopWork : startWork;
  const startStopButtonText = workTime ? 'Stop work' : 'Start work';
  const pauseResumeButtonAction = isPaused ? resumeWork : pauseWork;
  const pauseResumeButtonText = isPaused ? 'Resume work' : 'Pause work';

  return (
    <Container>
      <StatGroup>
        <Stat>
          <StatLabel>Time worked</StatLabel>
          <StatNumber>{formattedWorkTime}</StatNumber>
          <StatHelpText>
            <StatArrow type="increase" />
            Good job!
          </StatHelpText>
        </Stat>

        <Stat>
          <StatLabel>Paused work time</StatLabel>
          <StatNumber>{formattedPausedWorkTime}</StatNumber>
          <StatHelpText>
            <StatArrow type="decrease" />
            Get back to work.
          </StatHelpText>
        </Stat>
      </StatGroup>

      <Stat marginTop={5}>
        <StatLabel>Completed work time</StatLabel>
        <StatNumber>{formattedCompletedWorkTime}</StatNumber>
      </Stat>
      <ButtonGroup marginTop={30} variant="outline" spacing="6">
        <Button colorScheme="blue" onClick={startStopButtonAction}>
          {startStopButtonText}
        </Button>
        <Button onClick={pauseResumeButtonAction}>
          {pauseResumeButtonText}
        </Button>
      </ButtonGroup>
    </Container>
  );
}
