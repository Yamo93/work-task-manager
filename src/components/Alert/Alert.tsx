import { Alert, AlertIcon, CloseButton } from '@chakra-ui/react';
import React, { ReactElement } from 'react';

export type StatusType = 'success' | 'info' | 'warning' | 'error' | undefined;

interface AlertProps {
  isVisible: boolean;
  alertMessage: string;
  hideAlert: () => void;
  status?: StatusType;
}

export default function AlertWrapper({
  isVisible,
  alertMessage,
  hideAlert,
  status,
}: AlertProps): ReactElement | null {
  return isVisible ? (
    <Alert mb={5} status={status} variant="left-accent">
      <AlertIcon />
      {alertMessage}
      <CloseButton position="absolute" right="8px" top="8px" onClick={hideAlert} />
    </Alert>
  ) : null;
}

AlertWrapper.defaultProps = {
  status: 'success',
};
