import { Tabs } from '@mantine/core';
import { useLocation, useNavigate } from 'react-router-dom';

const TABS = [
  { value: 'effector', label: 'Effector' },
  { value: 'zustand', label: 'Zustand' },
  { value: 'mobx', label: 'MobX' },
  { value: 'react-query', label: 'React Query' },
];

export function TabNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const current = location.pathname.split('/')[1] || 'effector';

  return (
    <Tabs value={current} onChange={(value) => value && navigate(`/${value}`)} mb="md">
      <Tabs.List>
        {TABS.map((tab) => (
          <Tabs.Tab key={tab.value} value={tab.value}>
            {tab.label}
          </Tabs.Tab>
        ))}
      </Tabs.List>
    </Tabs>
  );
}
