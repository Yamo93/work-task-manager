import React, { ReactElement, useContext, useEffect, useState } from 'react';
import {
  Button,
  ButtonGroup,
  Container,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
} from '@chakra-ui/react';
import { IpcRendererEvent } from 'electron';
import moment from 'moment';

import WorkContext from '../context/WorkContext';
import IpcService from '../services/IpcService';
import { IWorkLog } from '../models/models';
import Calculator from '../utils/Calculator';

export default function WorkCheckIn(): ReactElement {
  const {
    startWork,
    stopWork,
    pauseWork,
    resumeWork,
    formatTime,
    workTime,
    completedWorkTime,
    completedPauseTime,
    pausedWorkTime,
    isPausing,
  } = useContext(WorkContext);

  const [workLogs, setWorkLogs] = useState<Array<IWorkLog>>([]);

  function onStopWork(): void {
    if (!stopWork) {
      throw new Error('stopWork prop method is not defined');
    }

    IpcService.listenToReadWorkLogs(
      (_event: IpcRendererEvent, logs: Array<IWorkLog>) => {
        setWorkLogs(logs);
      }
    );

    stopWork();
  }

  useEffect(() => {
    IpcService.listenToReadWorkLogs(
      (_event: IpcRendererEvent, logs: Array<IWorkLog>) => {
        setWorkLogs(logs);
      }
    );

    IpcService.readWorkLogs();
  }, []);

  const formattedWorkTime = formatTime?.(workTime);
  const formattedCompletedWorkTime = formatTime?.(completedWorkTime);
  const formattedCompletedPauseTime = formatTime?.(completedPauseTime);
  const formattedPausedWorkTime = formatTime?.(pausedWorkTime);
  const startStopButtonAction = workTime ? onStopWork : startWork;
  const startStopButtonText = workTime ? 'Stop work' : 'Start work';
  const pauseResumeButtonAction = isPausing ? resumeWork : pauseWork;
  const pauseResumeButtonText = isPausing ? 'Resume work' : 'Pause work';

  return (
    <>
      <Container maxW="container.xl">
        <StatGroup>
          <Stat>
            <StatLabel>Time worked</StatLabel>
            <StatNumber>{formattedWorkTime}</StatNumber>
          </Stat>

          <Stat>
            <StatLabel>Paused work time</StatLabel>
            <StatNumber>{formattedPausedWorkTime}</StatNumber>
          </Stat>
        </StatGroup>

        <StatGroup marginTop={5}>
          <Stat>
            <StatLabel>Completed work time</StatLabel>
            <StatNumber>{formattedCompletedWorkTime}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Completed pause time</StatLabel>
            <StatNumber>{formattedCompletedPauseTime}</StatNumber>
          </Stat>
        </StatGroup>
        <ButtonGroup marginTop={30} variant="outline" spacing="6">
          <Button
            colorScheme={workTime ? 'red' : 'blue'}
            onClick={startStopButtonAction}
          >
            {startStopButtonText}
          </Button>
          <Button disabled={!workTime} onClick={pauseResumeButtonAction}>
            {pauseResumeButtonText}
          </Button>
        </ButtonGroup>
      </Container>
      <Table variant="simple" marginTop={15} colorScheme="teal" size="lg">
        <Thead>
          <Tr>
            <Th>Date</Th>
            <Th isNumeric>Completed work time (hours)</Th>
            <Th isNumeric>Completed pause time (hours)</Th>
          </Tr>
        </Thead>
        <Tbody>
          {workLogs.map((workLog) => (
            <Tr key={workLog.id}>
              <Td>{moment(workLog.date).format('dddd YYYY-MM-DD')}</Td>
              <Td isNumeric>
                {Calculator.getHoursBySeconds(workLog.workTimeInSeconds)}
              </Td>
              <Td isNumeric>
                {Calculator.getHoursBySeconds(workLog.pausedWorkTimeInSeconds)}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </>
  );
}
