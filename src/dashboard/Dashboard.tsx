import React, { ReactElement } from 'react';
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
} from '@chakra-ui/react';
import os from 'os';
import s from './Dashboard.scss';
import TabView from '../TabView/TabView';

export default function Dashboard(): ReactElement {
  const { username } = os.userInfo();
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
                <Container>Work check-in</Container>
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
