import { MantineProvider, Container } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { TabNav } from './shared/components';
import { CarsPage as EffectorCarsPage } from './effector/CarsPage';
import { CarsPage as ZustandCarsPage } from './zustand/CarsPage';
import { CarsPage as MobxCarsPage } from './mobx/CarsPage';
import { CarsPage as ReactQueryCarsPage } from './react-query/CarsPage';

const queryClient = new QueryClient();

export default function App() {
  return (
    <MantineProvider defaultColorScheme="light">
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Container size="lg" py="md">
            <TabNav />
            <Routes>
              <Route path="/" element={<Navigate to="/effector" replace />} />
              <Route path="/effector" element={<EffectorCarsPage />} />
              <Route path="/zustand" element={<ZustandCarsPage />} />
              <Route path="/mobx" element={<MobxCarsPage />} />
              <Route path="/react-query" element={<ReactQueryCarsPage />} />
              <Route path="*" element={<Navigate to="/effector" replace />} />
            </Routes>
          </Container>
        </BrowserRouter>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </MantineProvider>
  );
}
