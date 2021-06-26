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
import os from 'os';

import TabView from '../TabView/TabView';

import s from './Dashboard.module.scss';

import WorkCheckIn from '../WorkCheckIn/WorkCheckIn';
import IpcService from '../services/IpcService';

export default function Dashboard(): ReactElement {
  const { username } = os.userInfo();
  const { toggleColorMode } = useColorMode();

  useEffect(() => {
    IpcService.listenToToggleDarkMode(() => {
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
