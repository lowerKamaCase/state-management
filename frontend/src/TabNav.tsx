import { Tabs } from '@mantine/core';
import { useLocation, useNavigate } from 'react-router-dom';

const TABS = [
  { value: 'empty', label: 'Empty' },
  { value: 'effector', label: 'Effector' },
  { value: 'zustand', label: 'Zustand' },
  { value: 'mobx', label: 'MobX' },
  { value: 'react-query', label: 'React Query' },
  { value: 'rxjs', label: 'RxJS' },
  { value: 'reatom', label: 'Reatom' },
  { value: 'xstate', label: 'XState' },
  { value: 'effector-dynamic-models', label: 'Effector (dynamic)' },
  { value: 'zustand-dynamic-models', label: 'Zustand (dynamic)' },
  { value: 'mobx-dynamic-models', label: 'MobX (dynamic)' },
  { value: 'rxjs-dynamic-models', label: 'RxJS (dynamic)' },
  { value: 'reatom-dynamic-models', label: 'Reatom (dynamic)' },
  { value: 'xstate-dynamic-models', label: 'XState (dynamic)' },
];

export function TabNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const current = location.pathname.split('/')[1] || 'effector';

  return (
    <Tabs
      value={current}
      onChange={(value) => {
        if (value) {
          void navigate(`/${value}`);
        }
      }}
      mb="md"
    >
      <Tabs.List>
        {TABS.map((tab) => {
          return (
            <Tabs.Tab key={tab.value} value={tab.value}>
              {tab.label}
            </Tabs.Tab>
          );
        })}
      </Tabs.List>
    </Tabs>
  );
}
