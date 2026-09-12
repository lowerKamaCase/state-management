import { Container, MantineProvider } from '@mantine/core';
import { reatomContext, useCreateCtx } from '@reatom/npm-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { CarsPage as EffectorDynamicCarsPage } from './effector-dynamic-models/ui/CarsPage';
import { CarsPage as EffectorCarsPage } from './effector/ui/CarsPage';
import { EmptyPage } from './empty/EmptyPage';
import { CarsPage as MobxDynamicCarsPage } from './mobx-dynamic-models/ui/CarsPage';
import { CarsPage as MobxCarsPage } from './mobx/ui/CarsPage';
import { CarsPage as ReactQueryCarsPage } from './react-query/ui/CarsPage';
import { CarsPage as ReatomDynamicCarsPage } from './reatom-dynamic-models/ui/CarsPage';
import { CarsPage as ReatomCarsPage } from './reatom/ui/CarsPage';
import { CarsPage as RxjsDynamicCarsPage } from './rxjs-dynamic-models/ui/CarsPage';
import { CarsPage as RxjsCarsPage } from './rxjs/ui/CarsPage';
import { TabNav } from './TabNav';
import { CarsPage as XstateDynamicCarsPage } from './xstate-dynamic-models/ui/CarsPage';
import { CarsPage as XstateCarsPage } from './xstate/ui/CarsPage';
import { CarsPage as ZustandDynamicCarsPage } from './zustand-dynamic-models/ui/CarsPage';
import { CarsPage as ZustandCarsPage } from './zustand/ui/CarsPage';

const queryClient = new QueryClient();

export default function App() {
  // reatom needs some ctx to read/write atoms — one ctx here, shared by both
  // the static and dynamic reatom tabs, is enough: it's just the runtime,
  // isolation between the two tabs comes from creating separate atoms
  // (static: module scope, dynamic: a factory called via useMemo), not from
  // separate contexts.
  const reatomCtx = useCreateCtx();

  return (
    <reatomContext.Provider value={reatomCtx}>
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
                <Route path="/rxjs" element={<RxjsCarsPage />} />
                <Route path="/reatom" element={<ReatomCarsPage />} />
                <Route path="/xstate" element={<XstateCarsPage />} />
                <Route path="/empty" element={<EmptyPage />} />
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
                <Route
                  path="/rxjs-dynamic-models"
                  element={<RxjsDynamicCarsPage />}
                />
                <Route
                  path="/reatom-dynamic-models"
                  element={<ReatomDynamicCarsPage />}
                />
                <Route
                  path="/xstate-dynamic-models"
                  element={<XstateDynamicCarsPage />}
                />
                <Route path="*" element={<Navigate to="/effector" replace />} />
              </Routes>
            </Container>
          </BrowserRouter>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </MantineProvider>
    </reatomContext.Provider>
  );
}
