import { useSyncExternalStore } from 'react';
import type { BehaviorSubject } from 'rxjs';

/**
 * Plain RxJS has no official React binding — this is the standard bridge:
 * useSyncExternalStore subscribes to the subject and reads its always-current
 * value via getValue(). Shared by every rxjs/rxjs-dynamic-models model file
 * (static or dynamic — a fresh BehaviorSubject works with this hook exactly
 * the same way a module-level one does).
 */
export function useBehaviorSubject<T>(subject$: BehaviorSubject<T>): T {
  return useSyncExternalStore(
    (onStoreChange) => {
      const subscription = subject$.subscribe(() => {
        onStoreChange();
      });
      return () => {
        subscription.unsubscribe();
      };
    },
    () => {
      return subject$.getValue();
    },
  );
}
