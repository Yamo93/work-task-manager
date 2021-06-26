import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  useDisclosure,
} from '@chakra-ui/react';
import React, { ReactElement, ReactNode, useRef } from 'react';

interface Props {
  onConfirm: () => void;
  headerText: string;
  confirmMessage: string;
  buttonColorScheme?: string;
  children: ReactNode;
}

export default function ConfirmDialogButton({
  onConfirm,
  headerText,
  confirmMessage,
  children,
  buttonColorScheme,
}: Props): ReactElement {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <Button colorScheme={buttonColorScheme} onClick={onOpen}>
        {children}
      </Button>
      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>{headerText}</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>{confirmMessage}</AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              No
            </Button>
            <Button colorScheme="red" ml={3} onClick={onConfirm}>
              Yes
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

ConfirmDialogButton.defaultProps = {
  buttonColorScheme: 'red',
};
