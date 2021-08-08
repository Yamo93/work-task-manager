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
import { IWorkLog } from '../models/WorkLog';
import Calculator from '../utils/Calculator';
import ConfirmDialogButton from '../components/ConfirmDialog/ConfirmDialog';
import useAlert from '../hooks/useAlert';
import AppendTimeModal, { ActionPayload } from '../modals/AppendTimeModal/AppendTimeModal';

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
    appendWorkTime,
    appendPauseTime,
  } = useContext(WorkContext);

  const { showAlert: showSuccessAlert, RenderAlert: SuccessAlert } = useAlert();

  const [workLogs, setWorkLogs] = useState<Array<IWorkLog>>([]);

  function onStopWork(): void {
    if (!stopWork) {
      throw new Error('stopWork prop method is not defined.');
    }

    IpcService.listenToReadWorkLogs((_event: IpcRendererEvent, logs: Array<IWorkLog>) => {
      setWorkLogs(logs);
    });

    stopWork();
    showSuccessAlert('Congratulations. You have completed the work session.');
  }

  function appendTime(payload: ActionPayload) {
    appendWorkTime?.(payload.appendedWorkTime, payload.withdrawFromPauseTime);
    appendPauseTime?.(payload.appendedPauseTime, payload.withdrawFromWorkTime);
  }

  useEffect(() => {
    IpcService.listenToReadWorkLogs((_event: IpcRendererEvent, logs: Array<IWorkLog>) => {
      setWorkLogs(logs);
    });

    IpcService.readWorkLogs();
  }, []);

  const formattedWorkTime = formatTime?.(workTime);
  const formattedCompletedWorkTime = formatTime?.(completedWorkTime);
  const formattedCompletedPauseTime = formatTime?.(completedPauseTime);
  const formattedPausedWorkTime = formatTime?.(pausedWorkTime);
  const startButtonText = 'Start work';
  const stopButtonText = 'Stop work';
  const pauseResumeButtonAction = isPausing ? resumeWork : pauseWork;
  const pauseResumeButtonText = isPausing ? 'Resume work' : 'Pause work';
  const appendTimeButtonText = 'Append time';
  const appendTimeModalTitleText = 'Append time';
  const stopConfirmHeaderText = 'Stop work';
  const saveText = 'Save';
  const stopConfirmMessage = 'Are you sure that you want to stop the work session?';

  return (
    <>
      <SuccessAlert />
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
          {workTime ? (
            <ConfirmDialogButton
              onConfirm={onStopWork}
              headerText={stopConfirmHeaderText}
              confirmMessage={stopConfirmMessage}
            >
              {stopButtonText}
            </ConfirmDialogButton>
          ) : (
            <Button colorScheme="blue" onClick={startWork}>
              {startButtonText}
            </Button>
          )}
          <Button disabled={!workTime} onClick={pauseResumeButtonAction}>
            {pauseResumeButtonText}
          </Button>
          <AppendTimeModal
            disabled={!workTime}
            modalTitle={appendTimeModalTitleText}
            openButtonText={appendTimeButtonText}
            actionButtonText={saveText}
            action={appendTime}
          />
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
              <Td isNumeric>{Calculator.getHoursBySeconds(workLog.workTimeInSeconds)}</Td>
              <Td isNumeric>{Calculator.getHoursBySeconds(workLog.pausedWorkTimeInSeconds)}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </>
  );
}
