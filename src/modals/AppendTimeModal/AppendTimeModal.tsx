import {
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  useDisclosure,
} from '@chakra-ui/react';
import React, { ReactElement, useRef, useState } from 'react';

export interface ActionPayload {
  appendedWorkTime: number;
  appendedPauseTime: number;
  withdrawFromWorkTime: boolean;
  withdrawFromPauseTime: boolean;
}

interface Props {
  openButtonText: string;
  modalTitle: string;
  actionButtonText: string;
  action: (actionPayload: ActionPayload) => void;
  disabled: boolean;
}

export default function AppendTimeModal({
  openButtonText,
  modalTitle,
  actionButtonText,
  action,
  disabled,
}: Props): ReactElement {
  const [appendedWorkTime, setAppendedWorkTime] = useState(0);
  const [appendedPauseTime, setAppendedPauseTime] = useState(0);
  const [withdrawFromPauseTime, setWithdrawFromPauseTime] = useState(true);
  const [withdrawFromWorkTime, setWithdrawFromWorkTime] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = useRef<HTMLInputElement>(null);

  const appendedWorkTimeLabel = 'Appended work time (minutes)';
  const appendedPauseTimeLabel = 'Appended pause time (minutes)';
  const withdrawFromPauseTimeText = 'Withdraw from pause time';
  const withdrawFromWorkTimeText = 'Withdraw from work time';

  function clearValues() {
    setAppendedWorkTime(0);
    setAppendedPauseTime(0);
    setWithdrawFromPauseTime(true);
    setWithdrawFromWorkTime(true);
  }

  function close() {
    onClose();
    clearValues();
  }

  function onCloseButtonClick() {
    const actionPayload: ActionPayload = {
      appendedWorkTime,
      appendedPauseTime,
      withdrawFromPauseTime,
      withdrawFromWorkTime,
    };
    action(actionPayload);
    close();
  }

  return (
    <>
      <Button disabled={disabled} colorScheme="green" variant="outline" onClick={onOpen}>
        {openButtonText}
      </Button>

      <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={close}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{modalTitle}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={5}>
              <FormLabel>{appendedWorkTimeLabel}</FormLabel>
              <NumberInput
                ref={initialRef}
                value={appendedWorkTime}
                onChange={(newValue: string) => setAppendedWorkTime(+newValue)}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              <Checkbox
                colorScheme="green"
                isChecked={withdrawFromPauseTime}
                onChange={(e) => setWithdrawFromPauseTime(e.target.checked)}
              >
                {withdrawFromPauseTimeText}
              </Checkbox>
            </FormControl>

            <FormControl>
              <FormLabel>{appendedPauseTimeLabel}</FormLabel>
              <NumberInput
                ref={initialRef}
                value={appendedPauseTime}
                onChange={(newValue: string) => setAppendedPauseTime(+newValue)}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              <Checkbox
                colorScheme="green"
                isChecked={withdrawFromWorkTime}
                onChange={(e) => setWithdrawFromWorkTime(e.target.checked)}
              >
                {withdrawFromWorkTimeText}
              </Checkbox>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={close}>
              Close
            </Button>
            <Button colorScheme="blue" onClick={onCloseButtonClick}>
              {actionButtonText}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
