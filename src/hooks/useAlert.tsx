import React, { ReactElement, useState } from 'react';
import Alert, { StatusType } from '../components/Alert/Alert';

interface HookResult {
  showAlert: (message: string) => void;
  RenderAlert: () => ReactElement;
}

interface AlertType {
  [key: string]: StatusType;
}

export const alertTypes: AlertType = {
  success: 'success',
  info: 'info',
  warning: 'warning',
  error: 'error',
};

export default function useAlert(status: StatusType = 'success'): HookResult {
  const [isVisible, setIsVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  function showAlert(message: string): void {
    setAlertMessage(message);
    setIsVisible(true);
  }

  function hideAlert(): void {
    setIsVisible(false);
  }

  function RenderAlert(): ReactElement {
    return (
      <Alert
        status={status}
        isVisible={isVisible}
        alertMessage={alertMessage}
        hideAlert={hideAlert}
      />
    );
  }

  return {
    showAlert,
    RenderAlert,
  };
}
