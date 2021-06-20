import React, { ReactElement, useEffect } from 'react';
import {
  Container,
  Box,
  Center,
  Heading,
  TabList,
  Tabs,
  Tab,
  TabPanels,
  TabPanel,
  useColorMode,
} from '@chakra-ui/react';
import { ipcRenderer } from 'electron';
import os from 'os';

import TabView from '../TabView/TabView';

import s from './Dashboard.scss';
import WorkCheckIn from '../WorkCheckIn/WorkCheckIn';

export default function Dashboard(): ReactElement {
  const { username } = os.userInfo();
  const { toggleColorMode } = useColorMode();

  useEffect(() => {
    ipcRenderer.once('toggle-dark-mode', () => {
      toggleColorMode();
    });
  }, [toggleColorMode]);

  return (
    <div className={s.dashboard}>
      <Container maxW="container.xl">
        <Tabs
          size="md"
          variant="soft-rounded"
          colorScheme="green"
          align="center"
        >
          <TabList>
            <Tab>Home</Tab>
            <Tab>Work check-in</Tab>
            <Tab>Workspaces</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <TabView>
                <Box textStyle="h2">
                  <Center>
                    <Heading fontSize="2xl">
                      Welcome to the Dashboard, {username}! 🙂
                    </Heading>
                  </Center>
                </Box>
              </TabView>
            </TabPanel>
            <TabPanel>
              <TabView>
                <WorkCheckIn />
              </TabView>
            </TabPanel>
            <TabPanel>
              <TabView>
                <Container>Workspaces</Container>
              </TabView>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>
    </div>
  );
}
