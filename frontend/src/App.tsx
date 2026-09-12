import { Container, MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { CarsPage as EffectorDynamicCarsPage } from './effector-dynamic-models/ui/CarsPage';
import { CarsPage as EffectorCarsPage } from './effector/ui/CarsPage';
import { CarsPage as MobxDynamicCarsPage } from './mobx-dynamic-models/ui/CarsPage';
import { CarsPage as MobxCarsPage } from './mobx/ui/CarsPage';
import { CarsPage as ReactQueryCarsPage } from './react-query/ui/CarsPage';
import { TabNav } from './TabNav';
import { CarsPage as ZustandDynamicCarsPage } from './zustand-dynamic-models/ui/CarsPage';
import { CarsPage as ZustandCarsPage } from './zustand/ui/CarsPage';

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
              <Route
                path="/effector-dynamic-models"
                element={<EffectorDynamicCarsPage />}
              />
              <Route
                path="/zustand-dynamic-models"
                element={<ZustandDynamicCarsPage />}
              />
              <Route
                path="/mobx-dynamic-models"
                element={<MobxDynamicCarsPage />}
              />
              <Route path="*" element={<Navigate to="/effector" replace />} />
            </Routes>
          </Container>
        </BrowserRouter>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </MantineProvider>
  );
}
